from tasks_roles_mapping import role_tasks_mapping
import xml.etree.ElementTree as ET

# Namespace (TO BE VERIFIED WHEN WE TEST NEW MODELS)
NS = {
    'bpmn': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
    'bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
    'omgdc': 'http://www.omg.org/spec/DD/20100524/DC',
    'ns6': 'http://www.omg.org/spec/DD/20100524/DI'
}

def get_original_x_position(element_id, bpmn_plane, NS):
    """
    Find the x-position of a task or gateway in the original BPMN model.
    """
    for shape in bpmn_plane.findall(f".//{{{NS['bpmndi']}}}BPMNShape"):
        if shape.get(f"bpmnElement") == element_id:
            bounds = shape.find(f"{{{NS['omgdc']}}}Bounds")
            if bounds is not None:
                return float(bounds.get("x"))
    return None


def calculate_new_position_for_element(element_id, role_to_tasks, bpmn_plane, NS):
    """
    Calculate the new position for a BPMN element (task or gateway) based on its lane (role).

    Args:
    - element_id: The ID of the BPMN element (task or gateway).
    - role_to_tasks: A dictionary mapping roles to their tasks.
    - bpmn_plane: The root element that contains the positions and the tasks.
    - NS: Namespace dictionary for the BPMN model.

    Returns:
    - A tuple (x, y) with the updated positions.
    """
    for role, tasks in role_to_tasks.items():
        if element_id in tasks:
            x_pos = get_original_x_position(element_id, bpmn_plane, NS)
            if x_pos is None:
                return None

            task_index = tasks.index(element_id)
            y_pos = 100 * task_index
            return x_pos, y_pos

    return None

def adjust_tasks(root, bpmn_plane, NS, task_role_map, lane_set):
    tasks = root.findall(f".//{{{NS['bpmn']}}}task")
    role_ids = {}
    task_positions = {}

    for task in tasks:
        task_id = task.get('id')
        task_name = task.get('name')
        task_shape = bpmn_plane.find(f".//{{{NS['bpmndi']}}}BPMNShape[@bpmnElement='{task_id}']")
        if task_shape is not None:
            bounds = task_shape.find(f"{{{NS['omgdc']}}}Bounds")
            if bounds is not None:
                x_pos = float(bounds.get('x'))
                y_pos = float(bounds.get('y'))
                task_positions[task_id] = (task_name, x_pos, y_pos)

    y_position = 0

    for role, task_list in task_role_map.items():
        role_id = f"Lane_{role.replace(' ', '_')}"

        lane = ET.SubElement(lane_set, f"{{{NS['bpmn']}}}lane", {"id": role_id, "name": role})
        role_ids[role] = lane

        lane_shape = ET.SubElement(bpmn_plane, f"{{{NS['bpmndi']}}}BPMNShape", {
            "bpmnElement": lane.get('id')
        })
        ET.SubElement(lane_shape, f"{{{NS['omgdc']}}}Bounds", {
            "x": "0", "y": str(y_position),
            "width": "10000", "height": "300"
        })

        lane_y_position = y_position + 100

        for task_name in task_list:
            task_id = None
            task_x_position = None

            for task in tasks:
                if task.get('name') == task_name:
                    task_id = task.get('id')
                    task_x_position = task_positions[task_id][1]
                    break

            if task_id:
                task_shape = bpmn_plane.find(f".//{{{NS['bpmndi']}}}BPMNShape[@bpmnElement='{task_id}']")
                if task_shape is not None:
                    bounds = task_shape.find(f"{{{NS['omgdc']}}}Bounds")
                    if bounds is not None:
                        bounds.set('y', str(lane_y_position))

                flow_ref = ET.SubElement(lane, f"{{{NS['bpmn']}}}flowNodeRef")
                flow_ref.text = task_id

                if task_shape is None:
                    task_shape = ET.SubElement(bpmn_plane, f"{{{NS['bpmndi']}}}BPMNShape", {
                        "id": f"{task_id}_di",
                        "bpmnElement": task_id
                    })

                ET.SubElement(task_shape, f"{{{NS['omgdc']}}}Bounds", {
                    "x": str(task_x_position), "y": str(lane_y_position),
                    "width": "120", "height": "80"
                })

                lane_y_position += 0

        y_position += 500

def adjust_sequence_flow_waypoints(root, bpmn_plane, NS):
    """
    Adjust the waypoints of the sequence flow to reflect the new positions of the connected tasks.

    Args:
    - sequence_flow: The sequenceFlow element.
    - bpmn_plane: The BPMN plane element that holds all the shapes.
    - NS: The namespace dictionary.

    Returns:
    - Updated sequenceFlow element with adjusted waypoints.
    """
    sequence_flows = root.findall(f".//{{{NS['bpmn']}}}sequenceFlow")
    for sequence_flow in sequence_flows:
        source_id = sequence_flow.get('sourceRef')
        target_id = sequence_flow.get('targetRef')

        source_shape = bpmn_plane.find(f".//{{{NS['bpmndi']}}}BPMNShape[@bpmnElement='{source_id}']")
        target_shape = bpmn_plane.find(f".//{{{NS['bpmndi']}}}BPMNShape[@bpmnElement='{target_id}']")

        if source_shape is None or target_shape is None:
            return sequence_flow

        source_bounds = source_shape.find(f"{{{NS['omgdc']}}}Bounds")
        target_bounds = target_shape.find(f"{{{NS['omgdc']}}}Bounds")

        if source_bounds is None or target_bounds is None:
            return sequence_flow

        source_x = float(source_bounds.get('x', '0'))
        source_y = float(source_bounds.get('y', '0'))
        target_x = float(target_bounds.get('x', '0'))
        target_y = float(target_bounds.get('y', '0'))
        flow_edge = bpmn_plane.find(f".//{{{NS['bpmndi']}}}BPMNEdge[@bpmnElement='{sequence_flow.get('id')}']")

        if flow_edge is not None:
            waypoints = flow_edge.findall(f"{{{NS['ns6']}}}waypoint")
            last_waypoint_idx = len(waypoints) - 1
            if len(waypoints) >= 2:
                waypoints[0].set('x', str(source_x))
                waypoints[0].set('y', str(source_y))

                waypoints[last_waypoint_idx].set('x', str(target_x))
                waypoints[last_waypoint_idx].set('y', str(target_y))


def adjust_gateways(root, bpmn_plane, NS):
    all_elements = root.findall(f".//{{{NS['bpmn']}}}*")

    shape_by_id = {
        shape.attrib['bpmnElement']: shape
        for shape in bpmn_plane.findall(f".//{{{NS['bpmndi']}}}BPMNShape")
    }

    flows_by_id = {
        flow.attrib['id']: flow
        for flow in root.findall(f".//{{{NS['bpmn']}}}sequenceFlow")
    }

    gateways = [el for el in all_elements if el.tag.endswith("Gateway")]
    for gateway in gateways:
        gateway_id = gateway.get('id')
        incoming = gateway.find(f"{{{NS['bpmn']}}}incoming")
        incoming_edge_id = incoming.text
        flow = flows_by_id.get(incoming_edge_id)

        source_id = flow.attrib.get('sourceRef')
        source_shape = shape_by_id.get(source_id)
        gateway_shape = shape_by_id.get(gateway.attrib['id'])

        source_bounds = source_shape.find(f".//{{{NS['omgdc']}}}Bounds")
        gateway_bounds = gateway_shape.find(f".//{{{NS['omgdc']}}}Bounds")

        y_pos = source_bounds.attrib['y']
        x_pos = get_original_x_position(gateway_id, bpmn_plane, NS)
        gateway_bounds.attrib['y'] = y_pos

        gateway_shape = ET.SubElement(bpmn_plane, f"{{{NS['bpmndi']}}}BPMNShape", {
            "bpmnElement": gateway_id
        })
        ET.SubElement(gateway_shape, f"{{{NS['omgdc']}}}Bounds", {
            "x": str(x_pos),
            "y": str(y_pos),
            "width": "100", "height": "100"
        })

def adjust_events(root, bpmn_plane, NS):
    all_elements = root.findall(f".//{{{NS['bpmn']}}}*")

    shape_by_id = {
        shape.attrib['bpmnElement']: shape
        for shape in bpmn_plane.findall(f".//{{{NS['bpmndi']}}}BPMNShape")
    }

    flows_by_id = {
        flow.attrib['id']: flow
        for flow in root.findall(f".//{{{NS['bpmn']}}}sequenceFlow")
    }

    events = [el for el in all_elements if el.tag.endswith("Event")]
    for event in events:
        event_id = event.get('id')
        incoming = event.find(f"{{{NS['bpmn']}}}incoming")
        outgoing = event.find(f"{{{NS['bpmn']}}}outgoing")
        if incoming is not None:
            incoming_edge_id = incoming.text
            flow = flows_by_id.get(incoming_edge_id)
            ref_id = flow.attrib.get('sourceRef')
            ref_shape = shape_by_id.get(ref_id)

        if outgoing is not None:
            outgoing_edge_id = outgoing.text
            flow = flows_by_id.get(outgoing_edge_id)
            ref_id = flow.attrib.get('targetRef')
            ref_shape = shape_by_id.get(ref_id)

        event_shape = shape_by_id.get(event.attrib['id'])
        source_bounds = ref_shape.find(f".//{{{NS['omgdc']}}}Bounds")

        event_bounds = event_shape.find(f".//{{{NS['omgdc']}}}Bounds")
        y_pos = source_bounds.attrib['y']
        x_pos = get_original_x_position(ref_id, bpmn_plane, NS)
        event_bounds.attrib['y'] = y_pos

        event_shape = ET.SubElement(bpmn_plane, f"{{{NS['bpmndi']}}}BPMNShape", {
            "bpmnElement": event_id
        })
        ET.SubElement(event_shape, f"{{{NS['omgdc']}}}Bounds", {
            "x": str(x_pos),
            "y": str(y_pos),
            "width": "100", "height": "100"
        })

def add_roles_to_bpmn(input_bpmn_file, output_bpmn_file, task_role_map):
    tree = ET.parse(input_bpmn_file)
    root = tree.getroot()
    process = root.find(f".//{{{NS['bpmn']}}}process")
    bpmn_plane = root.find(f".//{{{NS['bpmndi']}}}BPMNPlane")
    if bpmn_plane is None:
        bpmn_plane = ET.SubElement(root, f"{{{NS['bpmndi']}}}BPMNPlane", {"bpmnElement": process.get('id')})
    lane_set = ET.SubElement(process, f"{{{NS['bpmn']}}}laneSet")

    adjust_tasks(root, bpmn_plane, NS, task_role_map, lane_set)

    adjust_gateways(root, bpmn_plane, NS)

    adjust_events(root, bpmn_plane, NS)

    adjust_sequence_flow_waypoints(root, bpmn_plane, NS)

    tree.write(output_bpmn_file, xml_declaration=True, encoding='UTF-8')
    print(f"Updated BPMN file saved as {output_bpmn_file}")

role_tasks_mapping = role_tasks_mapping("logs/purchasingExample.csv", ["Role", "Activity"])
add_roles_to_bpmn("xmls/purchasingExampleRoles.bpmn", "xmls/purchasingExampleOutput.bpmn", role_tasks_mapping)