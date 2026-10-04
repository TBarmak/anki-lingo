import pytest
from api.scrapers.linguee import create_url, scrape_linguee, MAX_EXPRESSIONS, MAX_SENTENCES
from api.scrapers.tests.utils.get_mock_response import get_mock_response
from api.scrapers.tests.utils.read_expected_output import read_expected_output


def get_mock_response_filename(word, target_lang_abbv, native_lang_abbv):
    return f"linguee_{'_'.join(word.split())}_{target_lang_abbv}_{native_lang_abbv}.html"


def get_expected_output_filename(word, target_lang_abbv, native_lang_abbv):
    return f"linguee_{'_'.join(word.split())}_{target_lang_abbv}_{native_lang_abbv}_output.json"


class TestLinguee:
    def test_create_url_target_to_english(self):
        # Arrange
        word = "macérer"
        # Act
        url = create_url(word, "french", "english")
        # Assert
        assert url == "https://www.linguee.com/english-french/search?source=french&query=mac%C3%A9rer"

    def test_create_url_english_to_native(self):
        # Arrange
        word = "apple"
        # Act
        url = create_url(word, "english", "french")
        # Assert
        assert url == "https://www.linguee.com/english-french/search?source=english&query=apple"

    def test_create_url_multi_word(self):
        # Arrange
        phrase = "hablar de algo"
        # Act
        url = create_url(phrase, "spanish", "english")
        # Assert
        assert url == "https://www.linguee.com/english-spanish/search?source=spanish&query=hablar%20de%20algo"

    @pytest.mark.parametrize("word, target_lang, native_lang, target_slug, native_slug, target_abbv, native_abbv", [
        ("macérer", "Français", "English", "french", "english", "fr", "en"),
        ("hablar", "Español", "English", "spanish", "english", "es", "en"),
        ("apple", "English", "Français", "english", "french", "en", "fr"),
    ])
    def test_scrape_linguee(self, requests_mock, word, target_lang, native_lang, target_slug, native_slug, target_abbv, native_abbv):
        # Arrange
        mock_response = get_mock_response(
            get_mock_response_filename(word, target_abbv, native_abbv))
        requests_mock.get(create_url(word, target_slug, native_slug),
                          text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word, target_abbv, native_abbv))
        # Act
        scraped_data, url, status_code = scrape_linguee(
            word, target_lang, native_lang)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word, target_slug, native_slug)
        assert status_code == 200

    def test_scrape_linguee_caps_expressions_and_sentences(self, requests_mock):
        # Arrange
        word = "hablar"
        requests_mock.get(create_url(word, "spanish", "english"),
                          text=get_mock_response(get_mock_response_filename(word, "es", "en")))
        # Act
        scraped_data, _, _ = scrape_linguee(word, "español", "english")
        # Assert
        expressions = [entry for entry in scraped_data if "expression" in entry]
        sentences = [entry for entry in scraped_data
                     if "targetExampleSentences" in entry]
        assert len(expressions) == MAX_EXPRESSIONS
        assert len(sentences) == MAX_SENTENCES

    def test_scrape_linguee_no_results(self, requests_mock):
        # Arrange
        word = "xqzjvw"
        requests_mock.get(create_url(word, "french", "english"),
                          text=get_mock_response(get_mock_response_filename(word, "fr", "en")))
        # Act
        scraped_data, url, status_code = scrape_linguee(
            word, "français", "english")
        # Assert
        assert scraped_data == []
        assert url == create_url(word, "french", "english")
        assert status_code == 404

    @pytest.mark.parametrize("upstream_status", [403, 429])
    def test_scrape_linguee_upstream_error(self, requests_mock, upstream_status):
        # Arrange
        word = "macérer"
        requests_mock.get(create_url(word, "french", "english"),
                          status_code=upstream_status)
        # Act
        scraped_data, url, status_code = scrape_linguee(
            word, "français", "english")
        # Assert
        assert scraped_data == []
        assert url == create_url(word, "french", "english")
        assert status_code == upstream_status

    @pytest.mark.parametrize("target_lang, native_lang", [
        ("español", "português"),
        ("english", "english"),
        ("deutsch", "english"),
    ])
    def test_scrape_linguee_unsupported_pair(self, requests_mock, target_lang, native_lang):
        # Act
        scraped_data, url, status_code = scrape_linguee(
            "casa", target_lang, native_lang)
        # Assert
        assert scraped_data == []
        assert url == ""
        assert status_code == 400
        assert not requests_mock.called
