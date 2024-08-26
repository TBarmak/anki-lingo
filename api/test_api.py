from api.api import create_app
import pytest

@pytest.fixture()
def app():
    app = create_app()
    yield app

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

def test_supported_languages(client):
    # Act
    response = client.get("/api/supported-languages")
    # Assert
    keys = list(response.json.keys())
    languages = response.json["languages"]
    assert len(response.json.keys()) == 1
    assert len(set(languages) - set(["Français", "Português", "Español", "English"])) == 0
