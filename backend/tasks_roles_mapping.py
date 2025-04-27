import pandas as pd
import io
from typing import Union

def role_tasks_mapping(file: Union[str, bytes], headers: list) -> dict:
    """
    Parses an event log CSV from a file path or content and returns a dictionary mapping roles to tasks.
    :param file: File path (str) OR CSV content (bytes)
    :param headers: List of two column names [Role, Activity]
    :return: Dictionary {Role: [Activity1, Activity2, ...]}
    """
    try:
        if isinstance(file, str):
            df = pd.read_csv(file)
        elif isinstance(file, bytes):
            df = pd.read_csv(io.BytesIO(file))
        else:
            raise ValueError("Unsupported file type: must be str (filepath) or bytes (content).")

        if headers[0] not in df.columns or headers[1] not in df.columns:
            raise ValueError(f"CSV must contain predefined column names: {headers[0]} and {headers[1]}.")

        role_activity_map = df.groupby(headers[0])[headers[1]].unique().to_dict()

        return {role: list(tasks) for role, tasks in role_activity_map.items()}

    except Exception as e:
        print(f"Error processing file: {e}")
        return {}
