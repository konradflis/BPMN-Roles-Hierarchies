import pandas as pd

def role_tasks_mapping(filepath: str, headers: list) -> dict:
    """
    Parses an event log CSV file and returns a dictionary mapping roles to their unique tasks.

    Expected CSV format: columns 'Role' and 'Activity'
    :param filepath: Path to the CSV file
    :param headers: List of column names
    :return: Dictionary {Role: [Activity1, Activity2, ...]}
    """
    try:
        df = pd.read_csv(filepath)

        if headers[0] not in df.columns or headers[1] not in df.columns:
            raise ValueError("CSV must contain predefined column "
                             "names: {} and {}.".format(headers[0], headers[1]))

        role_activity_map = df.groupby(headers[0])[headers[1]].unique().to_dict()

        return {role: list(tasks) for role, tasks in role_activity_map.items()}

    except Exception as e:
        print(f"Error processing file: {e}")
        return {}
