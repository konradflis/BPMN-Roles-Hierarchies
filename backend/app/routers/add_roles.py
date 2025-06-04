from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import Response
from utils.tasks_roles_mapping import role_tasks_mapping
from utils.add_roles_to_bpmn import add_roles_to_bpmn
from utils.optimalization import caluculate_best_scenario
import json
router = APIRouter()

@router.post("/api/extract-roles")
async def extract_roles(
    csvFile: UploadFile,
    taskColumn: str = Form(...),
    roleColumn: str = Form(...)
):
    csv_content = await csvFile.read()
    headers = [roleColumn, taskColumn]
    mapping = role_tasks_mapping(csv_content, headers)
    role_keys = [*mapping]
    return {"roles": role_keys}


@router.post("/api/add-roles")
async def add_roles(
    bpmnFile: UploadFile,
    csvFile: UploadFile,
    adjust_in_out: bool = Form(...),
    taskColumn: str = Form(...),
    roleColumn: str = Form(...),
    role_order: str = Form(...)
):
    bpmn_content = await bpmnFile.read()
    csv_content = await csvFile.read()
    print(bpmn_content)

    headers = [roleColumn, taskColumn]
    mapping = role_tasks_mapping(csv_content, headers)

    ordered_roles = json.loads(role_order)
    ordered_mapping = {role: mapping[role] for role in ordered_roles if role in mapping}
    print(ordered_mapping)

    modified_bpmn_content = add_roles_to_bpmn(bpmn_content, ordered_mapping, adjust_in_out=adjust_in_out)
    return Response(content=modified_bpmn_content, media_type="application/xml")


@router.post("/api/add-roles-optim")
async def add_roles_optimal(
    bpmnFile: UploadFile,
    csvFile: UploadFile,
    adjust_in_out: bool = Form(...),
    taskColumn: str = Form(...),
    roleColumn: str = Form(...)
):
    bpmn_content = await bpmnFile.read()
    csv_content = await csvFile.read()

    headers = [roleColumn, taskColumn]
    mapping = role_tasks_mapping(csv_content, headers)

    best_BPMN_model = caluculate_best_scenario(bpmn_content, mapping, adjust_in_out=adjust_in_out)

    return Response(content=best_BPMN_model, media_type="application/xml")