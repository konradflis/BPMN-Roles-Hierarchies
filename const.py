from pathlib import Path

NS = {
    'bpmn': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
    'bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
    'omgdc': 'http://www.omg.org/spec/DD/20100524/DC',
    'ns6': 'http://www.omg.org/spec/DD/20100524/DI'
}


INPUT_PATH = Path("xmls/purchasingExampleRoles.bpmn")
OUTPUT_PATH = Path("xmls/purchasingExampleOutput1.bpmn")
LOGS_PATH = Path("logs/purchasingExample.csv")