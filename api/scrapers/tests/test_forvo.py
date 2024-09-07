from api.scrapers.forvo import create_url, scrape_forvo
from unittest.mock import patch, mock_open
from api.scrapers.tests.utils.get_mock_response import get_mock_response


def get_mock_response_filename(word, lang_abbv):
    return f"forvo_{word}_{lang_abbv}.html"


class TestForvo:
    def test_create_url_one_word(self):
        # Arrange
        word = "abacaxi"
        lang_abbv = "pt_br"
        # Act
        url = create_url(word, lang_abbv)
        # Assert
        assert url == "https://forvo.com/word/abacaxi/#pt_br"

    def test_create_url_multi_word(self):
        # Arrange
        phrase = "j'ai de la chance"
        lang_abbv = "fr"
        # Act
        url = create_url(phrase, lang_abbv)
        # Assert
        assert url == "https://forvo.com/word/j%27ai_de_la_chance/#fr"

    def test_create_url_special_characters(self):
        # Arrange
        word = "baîller"
        lang_abbv = "fr"
        # Act
        url = create_url(word, lang_abbv)
        # Assert
        assert url == "https://forvo.com/word/ba%C3%AEller/#fr"

    @patch("urllib.request.urlopen")
    @patch("urllib.request.Request")
    @patch("urllib.request.install_opener")
    def test_scrape_forvo_avoir(self, mock_install_opener, mock_request, mock_urlopen, requests_mock):
        # Arrange
        word = "avoir"
        language = "français"
        mock_forvo_response = get_mock_response(
            get_mock_response_filename(word, 'fr'))
        requests_mock.get(create_url(word, 'fr'), text=mock_forvo_response)
        mock_audio_response = ""
        mock_urlopen.return_value.read.return_value = mock_audio_response.encode(
            "UTF-8")
        mock_file_open = mock_open()
        # Act
        with patch("builtins.open", mock_file_open, create=True):
            audio_filenames, url = scrape_forvo(word, language)
        # Assert
        mock_file_open.assert_called_with(
            "audio_files/pronunciation_fr_avoir.ogg", "b+w")
        assert audio_filenames == [
            {"audioFilenames": ["pronunciation_fr_avoir.ogg"]}]
        assert url == create_url(word, 'fr')
