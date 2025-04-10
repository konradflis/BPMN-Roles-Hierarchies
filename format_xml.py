"""
A simple script to format .xml so that it is readable.
Use case: one-line .xml files.
"""
from xml.dom.minidom import parseString

def format_xml(file_path: str) -> None:

    with open(file_path, "r", encoding="utf-8") as file:
        xml_content = file.read()

    xml_pretty = parseString(xml_content).toprettyxml(indent="  ")

    with open(file_path, "w", encoding="utf-8") as file:
        file.write(xml_pretty)

    print("Formatted XML saved (overwrote the original one)")