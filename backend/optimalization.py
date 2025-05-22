import numpy as np
from add_roles_to_bpmn import add_roles_to_bpmn
from itertools import permutations
import xml.etree.ElementTree as ET
from const import NS
from typing import TypedDict

class Point(TypedDict):
    x: float
    y: float

def distance(point1: Point, point2: Point):
    return np.sqrt((point1['x'] - point2['x'])**2 + (point1['y'] - point2['y'])**2)


def cost_fun(bpmn_mode: str | bytes) -> float:
    root = ET.fromstring(bpmn_mode)
    total_length = 0.0

    for edge in root.findall('.//bpmndi:BPMNEdge', NS):
        waypoints = edge.findall('ns6:waypoint', NS)
        points = [{'x': float(wp.attrib['x']), 'y': float(wp.attrib['y'])} for wp in waypoints]
        for i in range(len(points) - 1):
            total_length += distance(points[i], points[i + 1])

    return total_length


def caluculate_best_scenario(bpmn_mode: str | bytes, map_role: dict, adjust_in_out: bool) -> None | bytes:
    list_of_scenario = find_all_scenarios(map_role)
    fun_cost = np.inf
    best_model = None
    for scenario in list_of_scenario:
        new_model = add_roles_to_bpmn(bpmn_mode, scenario, adjust_in_out)
        scenario_cost = cost_fun(new_model)
        if scenario_cost < fun_cost:
            best_model = new_model
            fun_cost = scenario_cost
    return best_model


def find_all_scenarios(map_role: dict) -> list[dict]:
    return [dict((key, map_role[key]) for key in perm) for perm in permutations(map_role.keys())]