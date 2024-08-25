import os
from api.scrapers.larouse_fr import create_url, scrape_larouse
from api.scrapers.tests.utils.read_expected_output import read_expected_output


def get_mock_response(word):
    # TODO: This should be pulled into the utils folder, and used by all scrape test suites
    current_dir = os.path.dirname(os.path.abspath(__file__))
    mock_file_path = os.path.join(
        current_dir, 'mocks', f'larouse_fr_{"_".join(word.split())}.html')
    response = ""
    with open(mock_file_path, 'r') as f:
        response = f.read()
    return response


class TestLarouseFR:
    def test_create_url_one_word(self):
        # Arrange
        word = 'avoir'
        # Act
        url = create_url(word)
        # Assert
        assert url == 'https://www.larousse.fr/dictionnaires/francais/avoir'

    def test_create_url_multi_word(self):
        # Arrange
        phrase = 'il y a'
        # Act
        url = create_url(phrase)
        # Assert
        assert url == 'https://www.larousse.fr/dictionnaires/francais/il%20y%20a'

    def test_scrape_larouse_avoir(self, requests_mock):
        # Arrange
        word = 'avoir'
        mock_response = get_mock_response(word)
        requests_mock.get(create_url(word), text=mock_response)
        expected_response = read_expected_output(
            f'larouse_fr_{word}_output.json')
        # Act
        scraped_data, url = scrape_larouse(word)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word)

    def test_scrape_larouse_couteau(self, requests_mock):
        # Arrange
        word = 'couteau'
        mock_response = get_mock_response(word)
        requests_mock.get(create_url(word), text=mock_response)
        expected_response = read_expected_output(
            f'larouse_fr_{word}_output.json')
        # Act
        scraped_data, url = scrape_larouse(word)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(word)

    def test_scrape_larouse_il_y_a(self, requests_mock):
        # Arrange
        phrase = 'il y a'
        mock_response = get_mock_response(phrase)
        requests_mock.get(create_url(phrase), text=mock_response)
        expected_response = read_expected_output(
            f'larouse_fr_il_y_a_output.json')
        # Act
        scraped_data, url = scrape_larouse(phrase)
        # Assert
        assert scraped_data == expected_response
        assert url == create_url(phrase)
