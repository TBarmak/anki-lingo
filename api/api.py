import time
from utils.format_csv import create_csv_back
from scrapers.forvo import scrape_forvo
from scrapers.word_reference import scrape_word_reference
from flask import Flask, send_file, request
from zipfile import ZipFile
import hashlib

LANGUAGE_RESOURCES = [
	{
		"name": "Word Reference",
		"route": "api/wr/",
		"args": ["targetLang", "nativeLang", "word"],
		"outputs": ["word", "pos", "definition", "translations","targetExampleSentences", "nativeExampleSentences"],
		"supportedLanguages": ["english", "español", "português", "français"]
	},
	{
		"name": "SpanishDict",
		"route": "api/spanishdict/",
		"args": ["targetLang", "word"],
		"outputs": ["word", "pos", "translations", "targetExampleSentences", "nativeExampleSentences"],
		"supportedLanguages": ["english", "español"]
	},
	{
		"name": "Forvo",
		"route": "api/forvo/",
		"args": ["targetLang", "word"],
		"outputs": ["audio"],
		"supportedLanguages": ["français"]	
	}
]

app = Flask(__name__)

@app.route('/api/supported-languages')
def get_languages():
	supported_languages = [language.capitalize() for resource in LANGUAGE_RESOURCES for language in resource['supportedLanguages']]
	return {'languages': sorted(list(set(supported_languages)))}

@app.route('/api/resources/<language>')
def get_resources(language):
	resources = filter(lambda x: language.lower() in x['supportedLanguages'], LANGUAGE_RESOURCES)
	return {'resources': list(resources)}

@app.route('/api/wr/<target_lang>/<native_lang>/<word>')
def get_wr_word(target_lang, native_lang, word):
	return {'word': word, 'scrapedData': scrape_word_reference(word, target_lang, native_lang)}

@app.route('/api/forvo/<target_lang>/<word>')
def get_forvo_audio(target_lang, word):
	return {'word': word, 'scrapedData': scrape_forvo(word, target_lang)}

@app.route('/api/format-csv', methods=['POST'])
def format_csv():
	req = request.json
	hash = hashlib.sha256(str(req).encode()).hexdigest()
	zip_filename = f'anki-{hash}.zip'
	rows = []
	for word in req['scrapedData']:
		# TODO: Only include audio if it's selected as an output field
		audio_filenames = [filename for item in word['scrapedData'] for filename in item.get('audioFilenames', [])]
		with ZipFile(zip_filename, 'a') as zip_object:
			for audio_filename in audio_filenames:
				zip_object.write('audio_files/' + audio_filename, arcname='audio_files/' + audio_filename)
		card_front = word['word']
		card_back = create_csv_back(word['scrapedData'], req['exportFields'])
		audio_files_anki_format = "".join([f"[sound:{audio}]" for audio in audio_filenames])
		row = f"{card_front}|{audio_files_anki_format}<br>{card_back}"
		rows.append(row)
	csv = '\n'.join(rows)
	with ZipFile(zip_filename, 'a') as zip_object:
		zip_object.writestr('anki.csv', csv)
	return send_file(zip_filename)

