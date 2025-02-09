from api.scrapers.forvo import create_url, scrape_forvo
from unittest.mock import patch, mock_open, MagicMock
from api.scrapers.tests.utils.get_mock_response import get_mock_response
from urllib.error import HTTPError

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
    def test_scrape_forvo_avoir(self, mock_urlopen):
        # Arrange
        word = "avoir"
        language = "français"
        mock_response = get_mock_response(get_mock_response_filename(word, "fr"))
        mock_urlopen.return_value.read.return_value = mock_response.encode(
            "UTF-8")
        mock_urlopen.return_value.getcode.return_value = 200
        mock_file_open = mock_open()
        # Act
        with patch("builtins.open", mock_file_open, create=True):
            audio_filenames, url, status_code = scrape_forvo(word, language)
        # Assert
        mock_file_open.assert_called_with(
            "audio_files/pronunciation_fr_avoir.ogg", "b+w")
        assert audio_filenames == [
            {"audioFilenames": ["pronunciation_fr_avoir.ogg"]}]
        assert url == create_url(word, "fr") 
        assert status_code == 200

    @patch("urllib.request.urlopen")
    def test_scrape_forvo_unauthorized(self, mock_urlopen):
        # Arrange
        word = "avoir"
        language = "français"
        mock_urlopen.side_effect = HTTPError(
            url="https://forvo.com",
            code=403,
            msg="Forbidden",
            hdrs=None,
            fp=None
        )
        # Act
        audio_filenames, url, status_code = scrape_forvo(word, language)
        # Assert
        assert audio_filenames == []
        assert url == create_url(word, "fr")
        assert status_code == 403
