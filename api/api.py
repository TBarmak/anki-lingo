import time
from scrapers.word_reference import scrape_word_reference
from flask import Flask

LANGUAGE_RESOURCES = [
	{
		"name": "Word Reference",
		"route": "api/wr/",
		"args": ["targetLangAbbv", "nativeLangAbbv", "word"],
		"outputs": ["word", "pos", "definition", "translations","targetExampleSentences", "nativeExampleSentences"],
		"supportedLanguages": ["english", "español", "português", "français"]
	},
	{
		"name": "SpanishDict",
		"route": "api/spanishdict/",
		"args": ["targetLangAbbv", "word"],
		"outputs": ["word", "pos", "translations", "targetExampleSentences", "nativeExampleSentences"],
		"supportedLanguages": ["english", "español"]
	}
]

app = Flask(__name__)

@app.route('/api/time')
def get_current_time():
	return {'time': time.time() }

@app.route('/api/supported-languages')
def get_languages():
	return {'languages': ["English", "Español", "Français", "Português"]}

@app.route('/api/resources/<language>')
def get_resources(language):
	resources = filter(lambda x: language.lower() in x['supportedLanguages'], LANGUAGE_RESOURCES)
	return {'resources': list(resources)}

@app.route('/api/wr/<target_lang_abbv>/<native_lang_abbv>/<word>')
def get_wr_word(target_lang_abbv, native_lang_abbv, word):
	return {'word': word, 'scrapedData': scrape_word_reference(word, target_lang_abbv, native_lang_abbv)}
