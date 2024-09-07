from api.scrapers.michaelis_br import create_url, scrape_michaelis
from api.scrapers.tests.utils.get_mock_response import get_mock_response
from api.scrapers.tests.utils.read_expected_output import read_expected_output


def get_mock_response_filename(word):
    return f"michaelis_br_{word}.html"


def get_expected_output_filename(word):
    return f"michaelis_br_{word}_output.json"


class TestMichaelisBR:
    def test_create_url_one_word(self):
        # Arrange
        word = "homem"
        # Act
        url = create_url(word)
        # Assert
        assert url == "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/homem"

    def test_create_url_multi_word(self):
        # TODO: Find a multi-word phrase that has results to validate
        # Arrange
        phrase = "café da manhã"
        # Act
        url = create_url(phrase)
        # Assert
        assert url == "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/caf%C3%A9%20da%20manh%C3%A3"

    def test_scrape_michaelis_abacaxi(self, requests_mock):
        # Arrange
        word = "abacaxi"
        mock_response = get_mock_response(get_mock_response_filename(word))
        requests_mock.get(create_url(word), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word))
        # Act
        scraped_data, url, status_code = scrape_michaelis(word)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word)
        assert status_code == 200

    def test_scrape_michaelis_fiador(self, requests_mock):
        # Arrange
        word = "fiador"
        mock_response = get_mock_response(get_mock_response_filename(word))
        requests_mock.get(create_url(word), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word))
        # Act
        scraped_data, url, status_code = scrape_michaelis(word)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word)
        assert status_code == 200

    def test_scrape_michaelis_mofo(self, requests_mock):
        # Arrange
        word = "mofo"
        mock_response = get_mock_response(get_mock_response_filename(word))
        requests_mock.get(create_url(word), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word))
        # Act
        scraped_data, url, status_code = scrape_michaelis(word)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word)
        assert status_code == 200

    def test_scrape_michaelis_inegável(self, requests_mock):
        # Arrange
        word = "inegável"
        mock_response = get_mock_response(get_mock_response_filename(word))
        requests_mock.get(create_url(word), text=mock_response)
        expected_response = read_expected_output(
            get_expected_output_filename(word))
        # Act
        scraped_data, url, status_code = scrape_michaelis(word)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word)
        assert status_code == 200

    def test_scrape_michaelis_unauthorized(self, requests_mock):
        # Arrange
        word = "inegável"
        requests_mock.get(create_url(word), status_code=403)
        # Act
        scraped_data, url, status_code = scrape_michaelis(word)
        # Assert
        assert scraped_data == []
        assert url == create_url(word)
        assert status_code == 403
