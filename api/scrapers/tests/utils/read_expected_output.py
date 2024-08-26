import os
import json

def read_expected_output(file_name):
    current_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    file_path = os.path.join(current_dir, "expected_outputs", file_name)

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)