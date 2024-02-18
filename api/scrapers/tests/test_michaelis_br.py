from api.scrapers.michaelis_br import create_url, scrape_michaelis
import os
import json


def read_expected_output(file_name):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'expected_outputs', file_name)

    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)


class TestMichaelisBR:
    def test_create_url_one_word(self):
        # Arrange
        word = 'homem'
        # Act
        url = create_url(word)
        # Assert
        assert url == 'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/homem'

    def test_create_url_multi_word(self):
        # TODO: Find a multi-word phrase that has results to validate
        # Arrange
        phrase = 'café da manhã'
        # Act
        url = create_url(phrase)
        # Assert
        assert url == 'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/café%20da%20manhã'

    def test_scrape_michaelis_abacaxi(self, requests_mock):
        # Arrange
        word = 'abacaxi'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', f'michaelis_br_{word}.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/{word}', text=response)
        expected_response = read_expected_output(
            f'michaelis_br_{word}_output.json')
        # Act
        scraped_data, url = scrape_michaelis(word)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/{word}' 

    def test_scrape_michaelis_fiador(self, requests_mock):
        # Arrange
        word = 'fiador'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', f'michaelis_br_{word}.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/{word}', text=response)
        expected_response = read_expected_output(
            f'michaelis_br_{word}_output.json')
        # Act
        scraped_data, url = scrape_michaelis(word)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/{word}'
