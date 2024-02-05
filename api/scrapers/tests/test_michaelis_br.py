from api.scrapers.michaelis_br import create_url

class TestMichaelisBR:
    def test_create_url_one_word(self):
        # Arrange
        word = 'homem'
        # Act
        url = create_url(word)
        # Assert
        assert url == 'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/homem'

    def test_create_url_multi_word(self):
        # TODO: Find a multi-word phrase that has results to validate
        # Arrange
        phrase = 'café da manhã'
        # Act
        url = create_url(phrase)
        # Assert
        assert url == 'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/café%20da%20manhã' 