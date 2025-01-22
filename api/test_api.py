from api.api import create_app
import pytest


@pytest.fixture()
def app():
    app = create_app()
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_supported_languages(client):
    # Act
    response = client.get("/api/supported-languages")
    # Assert
    languages = response.json["languages"]
    assert len(response.json.keys()) == 1
    assert set(languages) == {"Français", "Português", "Español", "English", "Italiano"}


def test_english_resources(client):
    # Act
    response = client.get("/api/resources/english")
    # Assert
    resources = {obj["name"] for obj in response.json["resources"]}
    assert len(response.json.keys()) == 1
    assert resources == {"Word Reference", "SpanishDict", "Forvo"}


def test_español_resources(client):
    # Act
    response = client.get("/api/resources/español")
    # Assert
    resources = {obj["name"] for obj in response.json["resources"]}
    assert len(response.json.keys()) == 1
    assert resources == {"Word Reference", "SpanishDict", "Forvo"}


def test_português_resources(client):
    # Act
    response = client.get("/api/resources/português")
    # Assert
    resources = {obj["name"] for obj in response.json["resources"]}
    assert len(response.json.keys()) == 1
    assert resources == {"Word Reference",
                         "Michaelis BR", "Forvo", "Semanticar BR"}


def test_français_resources(client):
    # Act
    response = client.get("/api/resources/français")
    # Assert
    resources = {obj["name"] for obj in response.json["resources"]}
    assert len(response.json.keys()) == 1
    assert resources == {"Word Reference", "Forvo", "Larouse FR"}


def test_field_mapping(client):
    # Act
    response = client.get("/api/field-mapping")
    # Assert
    assert response.json == {
        "inputWord": "input word",
        "word": "word",
        "pos": "part of speech",
        "definition": "definition",
        "translations": "translations",
        "targetExampleSentences": "target example sentences",
        "nativeExampleSentences": "native example sentences",
        "audioFilenames": "audio",
        "expression": "expression",
        "expressionMeaning": "expression meaning"
    }
