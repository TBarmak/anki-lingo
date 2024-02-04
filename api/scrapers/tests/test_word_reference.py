from scrapers.word_reference import create_url

class TestWordReference:
    def test_create_url_one_word(self):
        # Arragne
        word = 'abacaxi'
        target_lang_abbv = 'pt'
        native_lang_abbv = 'en'
        # Act
        url = create_url(word, target_lang_abbv, native_lang_abbv)
        # Assert
        assert url == 'https://www.wordreference.com/pten/abacaxi'

    def test_create_url_multi_word(self):
        # Arrange
        phrase = 'avoir de la chance'
        target_lang_abbv = 'fr'
        native_lang_abbv = 'en'
        # Act
        url = create_url(phrase, target_lang_abbv, native_lang_abbv)
        # Assert
        assert url == 'https://www.wordreference.com/fren/avoir%20de%20la%20chance'
