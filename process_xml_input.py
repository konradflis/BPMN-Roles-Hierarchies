"""
A simple event logs generator.
.xml file transformed to event logs with simulated data.
"""

import xml.etree.ElementTree as ET
import pandas as pd
import random
from datetime import datetime, timedelta

# Insert the file path below
# DATA SOURCE: https://processmind.com/resources/docs/example-files/bpmn-examples
file_path = "xmls/purchasingExampleRoles.bpmn"

tree = ET.parse(file_path)
root = tree.getroot()

# Extract the namespace dynamically
namespace = root.tag.split("}")[0].strip("{")
namespaces = {'bpmn': namespace}

# Find all tasks dynamically (any tag that ends with "Task")
tasks_tags = [task_tag for task_tag in root.iter() if task_tag.tag.endswith("Task")]
task_names = [task.get("name") for task in tasks_tags if task.get("name")]
print(task_names)

# This dict can be modified to predefine task-performer. If a task is not mapped,
# its performer is marked as "Unknown" by default
roles = {"Distribute on job boards" : "HR"}

event_log = []
start_time = datetime(2025, 3, 26, 22, 0)

for case_id in range(1001, 1011):
    timestamp = start_time + timedelta(days=random.randint(0, 5))
    for task in task_names:
        event_log.append({
            "case_id": case_id,
            "activity": task,
            "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "resource": roles.get(task, "Unknown")
        })
        timestamp += timedelta(minutes=random.randint(30, 120))

# Saving to .csv with a timestamp
df = pd.DataFrame(event_log)
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
df.to_csv(f"logs/event_log_{timestamp}.csv", index=False)

print("Event logs saved to logs/event_log_{timestamp}.csv")
