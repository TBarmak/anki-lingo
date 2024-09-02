import os


def get_mock_response(filename):
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    mock_file_path = os.path.join(parent_dir, "mocks", filename)
    response = ""
    with open(mock_file_path, "r") as f:
        response = f.read()
    return response
