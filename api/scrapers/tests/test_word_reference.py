from api.scrapers.tests.utils.get_mock_response import get_mock_response
from api.scrapers.word_reference import create_url, scrape_word_reference
from api.scrapers.tests.utils.read_expected_output import read_expected_output


def get_mock_response_filename(word, target_lang_abbv, native_lang_abbv):
    return f"wr_{word}_{target_lang_abbv}_{native_lang_abbv}.html"


def get_expected_response_filename(word, target_lang_abbv, native_lang_abbv):
    return f"wr_{word}_{target_lang_abbv}_{native_lang_abbv}_output.json"


class TestWordReference:
    def test_create_url_one_word(self):
        # Arrange
        word = "abacaxi"
        target_lang_abbv = "pt"
        native_lang_abbv = "en"
        # Act
        url = create_url(word, target_lang_abbv, native_lang_abbv)
        # Assert
        assert url == "https://www.wordreference.com/pten/abacaxi"

    def test_create_url_multi_word(self):
        # Arrange
        phrase = "avoir de la chance"
        target_lang_abbv = "fr"
        native_lang_abbv = "en"
        # Act
        url = create_url(phrase, target_lang_abbv, native_lang_abbv)
        # Assert
        assert url == "https://www.wordreference.com/fren/avoir%20de%20la%20chance"

    def test_scrape_word_reference_abacaxi(self, requests_mock):
        # Arrange
        word = "abacaxi"
        target_lang = "Português"
        native_lang = "English"
        mock_response = get_mock_response(
            get_mock_response_filename(word, 'pt', 'en'))
        requests_mock.get(
            f"https://www.wordreference.com/pten/{word}", text=mock_response)
        expected_response = read_expected_output(
            get_expected_response_filename(word, 'pt', 'en'))
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word, 'pt', 'en')

    def test_scrape_word_reference_avoir(self, requests_mock):
        # Arrange
        word = "avoir"
        target_lang = "Français"
        native_lang = "English"
        mock_response = get_mock_response(
            get_mock_response_filename(word, 'fr', 'en'))
        requests_mock.get(
            f"https://www.wordreference.com/fren/{word}", text=mock_response)
        expected_response = read_expected_output(
            get_expected_response_filename(word, 'fr', 'en'))
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word, 'fr', 'en')

    def test_scrape_word_reference_vérifier(self, requests_mock):
        # Arrange
        word = "vérifier"
        target_lang = "Français"
        native_lang = "English"
        mock_response = get_mock_response(
            get_mock_response_filename(word, 'fr', 'en'))
        requests_mock.get(
            f"https://www.wordreference.com/fren/{word}", text=mock_response)
        expected_response = read_expected_output(
            get_expected_response_filename(word, 'fr', 'en'))
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word, 'fr', 'en')

    def test_scrape_word_reference_viejo(self, requests_mock):
        # Arrange
        word = "viejo"
        target_lang = "Español"
        native_lang = "English"
        mock_response = get_mock_response(
            get_mock_response_filename(word, 'es', 'en'))
        requests_mock.get(
            f"https://www.wordreference.com/esen/{word}", text=mock_response)
        expected_response = read_expected_output(
            get_expected_response_filename(word, 'es', 'en'))
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word, 'es', 'en')

    def test_scrape_word_reference_bad_target_lang(self):
        # Arrange
        word = "viejo"
        target_lang = "Fakelang"
        native_lang = "English"
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == []
        assert url == ""

    def test_scrape_word_reference_bad_input_lang(self):
        # Arrange
        word = "viejo"
        target_lang = "Español"
        native_lang = "Fakelang"
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == []
        assert url == ""

    def test_scrape_word_reference_bad_word(self, requests_mock):
        # Arrange
        word = "fakeword"
        target_lang = "Español"
        native_lang = "English"
        mock_response = get_mock_response(
            get_mock_response_filename(word, 'es', 'en'))
        requests_mock.get(
            f"https://www.wordreference.com/esen/{word}", text=mock_response)
        # Act
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == []
        assert url == create_url(word, 'es', 'en')
