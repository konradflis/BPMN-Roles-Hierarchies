from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import Response
from backend.tasks_roles_mapping import role_tasks_mapping
from backend.add_roles_to_bpmn import add_roles_to_bpmn

router = APIRouter()

@router.post("/api/add-roles")
async def add_roles(
    bpmnFile: UploadFile,
    csvFile: UploadFile,
    taskColumn: str = Form(...),
    roleColumn: str = Form(...)
):
    bpmn_content = await bpmnFile.read()
    csv_content = await csvFile.read()

    headers = [roleColumn, taskColumn]

    mapping = role_tasks_mapping(csv_content, headers)

    modified_bpmn_content = add_roles_to_bpmn(bpmn_content, mapping)


    return Response(content=modified_bpmn_content, media_type="application/xml")