from api.scrapers.semanticar_br import create_url, scrape_semanticar
import os
import json

def read_expected_output(file_name):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'expected_outputs', file_name)

    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)
    
class TestSemanticarBR:
    def test_create_url_one_word(self):
        # Arrange
        word = 'homem'
        # Act
        url = create_url(word)
        # Assert
        assert url == 'https://www.semanticar.com.br/homem'
    
    def test_scrape_semanticar_abacaxi(self, requests_mock):
        # Arrange
        word = 'abacaxi'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', f'semanticar_br_{word}.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://www.semanticar.com.br/{word}', text=response)
        expected_response = read_expected_output(
            f'semanticar_br_{word}_output.json')
        # Act
        scraped_data, url = scrape_semanticar(word)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.semanticar.com.br/{word}'

    def test_scrape_semanticar_mico(self, requests_mock):
        # Arrange
        word = 'mico'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', f'semanticar_br_{word}.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://www.semanticar.com.br/{word}', text=response)
        expected_response = read_expected_output(
            f'semanticar_br_{word}_output.json')
        # Act
        scraped_data, url = scrape_semanticar(word)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.semanticar.com.br/{word}'