from api.scrapers.word_reference import create_url, scrape_word_reference
from api.scrapers.tests.utils.read_expected_output import read_expected_output
import os


class TestWordReference:
    def test_create_url_one_word(self):
        # Arrange
        word = 'abacaxi'
        target_lang_abbv = 'pt'
        native_lang_abbv = 'en'
        # Act
        url = create_url(word, target_lang_abbv, native_lang_abbv)
        # Assert
        assert url == 'https://www.wordreference.com/pten/abacaxi'

    def test_create_url_multi_word(self):
        # Arrange
        phrase = 'avoir de la chance'
        target_lang_abbv = 'fr'
        native_lang_abbv = 'en'
        # Act
        url = create_url(phrase, target_lang_abbv, native_lang_abbv)
        # Assert
        assert url == 'https://www.wordreference.com/fren/avoir%20de%20la%20chance'

    def test_scrape_word_reference_abacaxi(self, requests_mock):
        # Arrange
        word = 'abacaxi'
        target_lang = 'Português'
        native_lang = 'English'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', 'wr_abacaxi_pt_en.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://www.wordreference.com/pten/{word}', text=response)
        expected_response = read_expected_output(
            'wr_abacaxi_pt_en_output.json')
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.wordreference.com/pten/{word}'

    def test_scrape_word_reference_avoir(self, requests_mock):
        # Arrange
        word = 'avoir'
        target_lang = 'Français'
        native_lang = 'English'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', 'wr_avoir_fr_en.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://www.wordreference.com/fren/{word}', text=response)
        expected_response = read_expected_output(
            'wr_avoir_fr_en_output.json')
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.wordreference.com/fren/{word}'

    def test_scrape_word_reference_vérifier(self, requests_mock):
        # Arrange
        word = 'vérifier'
        target_lang = 'Français'
        native_lang = 'English'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', 'wr_vérifier_fr_en.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://www.wordreference.com/fren/{word}', text=response)
        expected_response = read_expected_output(
            'wr_vérifier_fr_en_output.json')
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.wordreference.com/fren/{word}'

    def test_scrape_word_reference_viejo(self, requests_mock):
        # Arrange
        word = 'viejo'
        target_lang = 'Español'
        native_lang = 'English'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', 'wr_viejo_es_en.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://www.wordreference.com/esen/{word}', text=response)
        expected_response = read_expected_output(
            'wr_viejo_es_en_output.json')
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == f'https://www.wordreference.com/esen/{word}'

    def test_scrape_word_reference_bad_target_lang(self):
        # Arrange
        word = 'viejo'
        target_lang = 'Fakelang'
        native_lang = 'English'
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == []
        assert url == ''

    def test_scrape_word_reference_bad_input_lang(self):
        # Arrange
        word = 'viejo'
        target_lang = 'Español'
        native_lang = 'Fakelang'
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == []
        assert url == ''

    def test_scrape_word_reference_bad_word(self, requests_mock):
        # Arrange
        word = 'fakeword'
        target_lang = 'Español'
        native_lang = 'English'
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mock_file_path = os.path.join(
            current_dir, 'mocks', 'wr_fakeword_es_en.html')
        response = ""
        with open(mock_file_path, 'r') as f:
            response = f.read()
        requests_mock.get(
            f'https://www.wordreference.com/esen/{word}', text=response)
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == []
        assert url == f'https://www.wordreference.com/esen/{word}'
