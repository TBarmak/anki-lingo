from api.scrapers.larouse_fr import scrape_larouse
from api.scrapers.semanticar_br import scrape_semanticar
from api.utils.format_csv import create_csv_sides
from api.scrapers.michaelis_br import scrape_michaelis
from api.scrapers.spanishdict import scrape_spanishdict
from api.scrapers.forvo import scrape_forvo
from api.scrapers.word_reference import scrape_word_reference
from flask import Flask, send_file, request
from zipfile import ZipFile
import hashlib
import os

FLASHCARD_FIELDS = {
    "inputWord": "input word",
    "word": "word",
    "pos": "part of speech",
    "definition": "definition",
    "translations": "translations",
    "targetExampleSentences": "target example sentences",
    "nativeExampleSentences": "native example sentences",
    "audioFilenames": "audio",
    "expression": "expression",
    "expressionMeaning": "expression meaning"
}

LANGUAGE_RESOURCES = [
    {
        "name": "Word Reference",
        "route": "api/wr/",
        "args": ["targetLang", "nativeLang", "word"],
        "outputs": ["word", "pos", "definition", "translations", "targetExampleSentences", "nativeExampleSentences"],
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
        "name": "Michaelis BR",
        "route": "api/michaelis-br/",
        "args": ["word"],
        "outputs": ["word", "pos", "definition", "targetExampleSentences", "expression", "expressionMeaning"],
        "supportedLanguages": ["português"]
    },
    {
        "name": "Forvo",
        "route": "api/forvo/",
        "args": ["targetLang", "word"],
        "outputs": ["audioFilenames"],
        "supportedLanguages": ["français", "português", "español", "english"]
    },
    {
        "name": "Semanticar BR",
        "route": "api/semanticar-br/",
        "args": ["word"],
        "outputs": ["targetExampleSentences"],
        "supportedLanguages": ["português"]
    },
    {
        "name": "Larouse FR",
        "route": "api/larouse-fr/",
        "args": ["word"],
        "outputs": ["definition", "targetExampleSentences"],
        "supportedLanguages": ["français"]
    }
]


def create_app():
    app = Flask(__name__)

    @app.route("/api/supported-languages")
    def get_languages():
        supported_languages = [language.capitalize(
        ) for resource in LANGUAGE_RESOURCES for language in resource["supportedLanguages"]]
        return {"languages": sorted(list(set(supported_languages)))}

    @app.route("/api/resources/<language>")
    def get_resources(language):
        resources = filter(lambda x: language.lower()
                           in x["supportedLanguages"], LANGUAGE_RESOURCES)
        return {"resources": list(resources)}

    @app.route("/api/field-mapping")
    def get_field_mapping():
        return FLASHCARD_FIELDS

    @app.route("/api/wr/<target_lang>/<native_lang>/<word>")
    def get_wr_word(target_lang, native_lang, word):
        scraped_data, url = scrape_word_reference(
            word, target_lang, native_lang)
        return {"inputWord": word, "scrapedWordData": scraped_data, "url": url}

    @app.route("/api/spanishdict/<target_lang>/<word>")
    def get_spanishdict_word(target_lang, word):
        scraped_data, url = scrape_spanishdict(word, target_lang)
        return {"inputWord": word, "scrapedWordData": scraped_data, "url": url}

    @app.route("/api/michaelis-br/<word>")
    def get_michaelis_br_word(word):
        scraped_data, url = scrape_michaelis(word)
        return {"inputWord": word, "scrapedWordData": scraped_data, "url": url}

    @app.route("/api/semanticar-br/<word>")
    def get_semanticar_br_word(word):
        scraped_data, url = scrape_semanticar(word)
        return {"inputWord": word, "scrapedWordData": scraped_data, "url": url}

    @app.route("/api/forvo/<target_lang>/<word>")
    def get_forvo_audio(target_lang, word):
        scraped_data, url = scrape_forvo(word, target_lang)
        return {"inputWord": word, "scrapedWordData": scraped_data, "url": url}

    @app.route("/api/larouse-fr/<word>")
    def get_larouse_fr_word(word):
        scraped_data, url = scrape_larouse(word)
        return {"inputWord": word, "scrapedWordData": scraped_data, "url": url}

    @app.route("/api/format-csv", methods=["POST"])
    def format_csv():
        req = request.json
        hash = hashlib.sha256(str(req).encode()).hexdigest()
        zip_filename = f"anki-{hash}.zip"
        audio_filepath = "audio_files/"
        output_filepath = os.getcwd() + "/zip_files/"
        rows = []
        for word_data in req["scrapedData"]:
            audio_filenames = [filename for item in word_data["scrapedWordData"]
                               for filename in item.get("audioFilenames", [])]
            with ZipFile(output_filepath + zip_filename, "a") as zip_object:
                for audio_filename in audio_filenames:
                    zip_object.write(audio_filepath + audio_filename,
                                     arcname="audio_files/" + audio_filename)
            card_sides = create_csv_sides(word_data, req["cardFormat"])
            row = "|".join(card_sides)
            rows.append(row)
        csv = "\n".join(rows)
        with ZipFile(output_filepath + zip_filename, "a") as zip_object:
            zip_object.writestr("anki.csv", csv)
        return send_file(output_filepath + zip_filename)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
