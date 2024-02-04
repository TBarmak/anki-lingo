from api.scrapers.spanishdict import create_url

class TestSpanishdict:
    def test_create_url_one_word_español(self):
        # Arrange
        word = 'hombre'
        target_lang_abbv = 'es'
        # Act
        url = create_url(word, target_lang_abbv)
        # Assert
        assert url == 'https://www.spanishdict.com/translate/hombre?langFrom=es'

    def test_create_url_multi_word_español(self):
        # Arrange
        phrase = 'buenas noches'
        target_lang_abbv = 'es'
        # Act
        url = create_url(phrase, target_lang_abbv)
        # Assert
        assert url == 'https://www.spanishdict.com/translate/buenas%20noches?langFrom=es'

    def test_create_url_one_word_english(self):
        # Arrange
        word = 'woman'
        target_lang_abbv = 'en'
        # Act
        url = create_url(word, target_lang_abbv)
        # Assert
        assert url == 'https://www.spanishdict.com/translate/woman?langFrom=en'

    def test_create_url_multi_word_english(self):
        # Arrange
        phrase = 'good night'
        target_lang_abbv = 'en'
        # Act
        url = create_url(phrase, target_lang_abbv)
        # Assert
        assert url == 'https://www.spanishdict.com/translate/good%20night?langFrom=en'
