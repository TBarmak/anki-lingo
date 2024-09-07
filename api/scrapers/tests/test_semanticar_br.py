from api.scrapers.semanticar_br import create_url, scrape_semanticar
from api.scrapers.tests.utils.get_mock_response import get_mock_response
from api.scrapers.tests.utils.read_expected_output import read_expected_output


def get_mock_response_filename(word):
    return f"semanticar_br_{word}.html"


def get_expected_output_filename(word):
    return f"semanticar_br_{word}_output.json"


class TestSemanticarBR:
    def test_create_url_one_word(self):
        # Arrange
        word = "homem"
        # Act
        url = create_url(word)
        # Assert
        assert url == "https://www.semanticar.com.br/homem"

    def test_scrape_semanticar_abacaxi(self, requests_mock):
        # Arrange
        word = "abacaxi"
        mock_response = get_mock_response(
            get_mock_response_filename(word))
        requests_mock.get(create_url(word), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word))
        # Act
        scraped_data, url, status_code = scrape_semanticar(word)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word)
        assert status_code == 200

    def test_scrape_semanticar_mico(self, requests_mock):
        # Arrange
        word = "mico"
        mock_response = get_mock_response(
            get_mock_response_filename(word))
        requests_mock.get(create_url(word), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word))
        # Act
        scraped_data, url, status_code = scrape_semanticar(word)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word)
        assert status_code == 200

    def test_scrape_semanticar_unauthorized(self, requests_mock):
        # Arrange
        word = "mico"
        requests_mock.get(create_url(word), status_code=403)
        # Act
        scraped_data, url, status_code = scrape_semanticar(word)
        # Assert
        assert scraped_data == []
        assert url == create_url(word)
        assert status_code == 403
