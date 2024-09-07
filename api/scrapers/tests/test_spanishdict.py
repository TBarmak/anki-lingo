from api.scrapers.spanishdict import create_url, scrape_spanishdict
from api.scrapers.tests.utils.get_mock_response import get_mock_response
from api.scrapers.tests.utils.read_expected_output import read_expected_output


def get_mock_response_filename(word, target_lang_abbv):
    return f"spanishdict_{'_'.join(word.split())}_{target_lang_abbv}.html"


def get_expected_output_filename(word, target_lang_abbv):
    return f"spanishdict_{'_'.join(word.split())}_{target_lang_abbv}_output.json"


class TestSpanishdict:
    def test_create_url_one_word_español(self):
        # Arrange
        word = "hombre"
        target_lang_abbv = "es"
        # Act
        url = create_url(word, target_lang_abbv)
        # Assert
        assert url == "https://www.spanishdict.com/translate/hombre?langFrom=es"

    def test_create_url_multi_word_español(self):
        # Arrange
        phrase = "buenas noches"
        target_lang_abbv = "es"
        # Act
        url = create_url(phrase, target_lang_abbv)
        # Assert
        assert url == "https://www.spanishdict.com/translate/buenas%20noches?langFrom=es"

    def test_create_url_one_word_english(self):
        # Arrange
        word = "woman"
        target_lang_abbv = "en"
        # Act
        url = create_url(word, target_lang_abbv)
        # Assert
        assert url == "https://www.spanishdict.com/translate/woman?langFrom=en"

    def test_create_url_multi_word_english(self):
        # Arrange
        phrase = "good night"
        target_lang_abbv = "en"
        # Act
        url = create_url(phrase, target_lang_abbv)
        # Assert
        assert url == "https://www.spanishdict.com/translate/good%20night?langFrom=en"

    def test_scrape_spanishdict_viejo(self, requests_mock):
        # Arrange
        word = "viejo"
        target_lang = "Español"
        mock_response = get_mock_response(
            get_mock_response_filename(word, "es"))
        requests_mock.get(create_url(word, "es"), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word, "es"))
        # Act
        scraped_data, url, status_code = scrape_spanishdict(word, target_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word, "es")
        assert status_code == 200

    def test_scrape_spanishdict_poner(self, requests_mock):
        # Arrange
        word = "poner"
        target_lang = "Español"
        mock_response = get_mock_response(
            get_mock_response_filename(word, "es"))
        requests_mock.get(create_url(word, "es"), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word, "es"))
        # Act
        scraped_data, url, status_code = scrape_spanishdict(word, target_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word, "es")
        assert status_code == 200

    def test_scrape_spanishdict_think(self, requests_mock):
        # Arrange
        word = "think"
        target_lang = "English"
        mock_response = get_mock_response(
            get_mock_response_filename(word, "en"))
        requests_mock.get(create_url(word, "en"), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word, "en"))
        # Act
        scraped_data, url, status_code = scrape_spanishdict(word, target_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word, "en")
        assert status_code == 200

    def test_scrape_spanishdict_think(self, requests_mock):
        # Arrange
        word = "think"
        target_lang = "English"
        requests_mock.get(create_url(word, "en"), status_code=403)
        # Act
        scraped_data, url, status_code = scrape_spanishdict(word, target_lang)
        # Assert
        assert scraped_data == []
        assert url == create_url(word, "en")
        assert status_code == 403
