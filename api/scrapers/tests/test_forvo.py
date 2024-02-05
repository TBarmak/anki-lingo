from api.scrapers.forvo import create_url

class TestForvo:
    def test_create_url_one_word(self):
        # Arrange
        word = 'abacaxi'
        lang_abbv = 'pt_br'
        # Act
        url = create_url(word, lang_abbv)
        # Assert
        assert url == 'https://forvo.com/word/abacaxi/#pt_br'

    def test_create_url_multi_word(self):
        # Arrange
        phrase = "j'ai de la chance"
        lang_abbv = 'fr'
        # Act
        url = create_url(phrase, lang_abbv)
        # Assert
        assert url == 'https://forvo.com/word/j%27ai_de_la_chance/#fr'

    def test_create_url_special_characters(self):
        # Arrange
        word = 'baîller'
        lang_abbv = 'fr'
        # Act
        url = create_url(word, lang_abbv)
        # Assert
        assert url == 'https://forvo.com/word/ba%C3%AEller/#fr'
