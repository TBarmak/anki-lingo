from api.scrapers.spanishdict import create_url, scrape_spanishdict
import os
import json


def read_expected_output(file_name):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'expected_outputs', file_name)

    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)


class TestSpanishdict:
    def test_create_url_one_word_español(self):
        # Arrange
        word = 'hombre'
        target_lang_abbv = 'es'
        # Act
        url = create_url(word, target_lang_abbv)
        # Assert
        assert url == 'https://www.spanishdict.com/translate/hombre?langFrom=es'

    def test_create_url_multi_word_español(self):
        # Arrange
        phrase = 'buenas noches'
        target_lang_abbv = 'es'
        # Act
        url = create_url(phrase, target_lang_abbv)
        # Assert
        assert url == 'https://www.spanishdict.com/translate/buenas%20noches?langFrom=es'

    def test_create_url_one_word_english(self):
        # Arrange
        word = 'woman'
        target_lang_abbv = 'en'
        # Act
        url = create_url(word, target_lang_abbv)
        # Assert
        assert url == 'https://www.spanishdict.com/translate/woman?langFrom=en'

    def test_create_url_multi_word_english(self):
        # Arrange
        phrase = 'good night'
        target_lang_abbv = 'en'
        # Act
        url = create_url(phrase, target_lang_abbv)
        # Assert
        assert url == 'https://www.spanishdict.com/translate/good%20night?langFrom=en'

    def test_scrape_spanishdict_viejo(self, requests_mock):
        # Arrange
        word = 'viejo'
        target_lang = 'Español'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', f'spanishdict_{word}_es.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
            requests_mock.get(
                f'https://www.spanishdict.com/translate/{word}?langFrom=es', text=response)
        expected_response = read_expected_output(
            f'spanishdict_{word}_es_output.json')
        # Act
        scraped_data, url = scrape_spanishdict(word, target_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.spanishdict.com/translate/{word}?langFrom=es'

    def test_scrape_spanishdict_poner(self, requests_mock):
        # Arrange
        word = 'poner'
        target_lang = 'Español'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', f'spanishdict_{word}_es.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
            requests_mock.get(
                f'https://www.spanishdict.com/translate/{word}?langFrom=es', text=response)
        expected_response = read_expected_output(
            f'spanishdict_{word}_es_output.json')
        # Act
        scraped_data, url = scrape_spanishdict(word, target_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.spanishdict.com/translate/{word}?langFrom=es'

    def test_scrape_spanishdict_think(self, requests_mock):
        # Arrange
        word = 'think'
        target_lang = 'English'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', f'spanishdict_{word}_en.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
            requests_mock.get(
                f'https://www.spanishdict.com/translate/{word}?langFrom=en', text=response)
        expected_response = read_expected_output(
            f'spanishdict_{word}_en_output.json')
        # Act
        scraped_data, url = scrape_spanishdict(word, target_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.spanishdict.com/translate/{word}?langFrom=en' 
