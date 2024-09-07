# Anki Lingo
**Anki Lingo** is a React and Flask application for generating Anki flashcards for learning languages. It scrapes popular language learning sites like Word Reference, SpanishDict, and Forvo to fetch translations, example sentences, and much more!

<img src="./docs/photos/landing.png" alt="landing" width="800"/>

The user simply enters words in the target language, and selects resources for that language to scrape from.
<img src="./docs/photos/empty_home.png" alt="empty home" width="800"/>
<img src="./docs/photos/populated_home.png" alt="populated home" width="800"/>

After the information is scraped, the user can design the flashcards by selecting which fields to include, and which side to put them on. For example, I prefer to put example sentences in the target language on a separate side.
<img src="./docs/photos/design_flashcards.png" alt="design flashcards" width="800"/>
<img src="./docs/photos/csv_download.png" alt="csv download" width="800"/>

Lastly, the CSV can be downloaded and imported into Anki. When you click the "Download" button, a zip file will be downloaded with name `anki-lang-<timestamp>.zip`.

Expand the zip file to get the `anki.csv` and the `audio_files`, if applicable.

### Importing CSV into Anki
In Anki, click "Import File"
<img src="./docs/photos/anki_import.png" alt="anki import" width="800"/>
and select the `anki.csv` file from the expanded zip.

Make sure the "Field separator" is "Pipe", and that "Allow HTML in fields" is toggled on.
<img src="./docs/photos/anki_file_options.png" alt="anki file options" width="800"/>

Update the "Import options" and "Field mapping" according to how you designed your flashcards.
<img src="./docs/photos/anki_field_mapping.png" alt="anki field mapping" width="800"/>

Finally, click the "Import" button.

### Importing Audio Files into Anki
In order for the audio to work properly, the files from the zip must be copied into the Anki media folder. Refer to the [Anki docs](https://docs.ankiweb.net/files.html#file-locations) for specifics for each machine.

<img src="./docs/photos/anki_media_audio.png" alt="anki field mapping" width="800"/>

On mac, it's in the `~/Library/Application Support/Anki2` folder. I just added the following alias to easily open the folder that the files need to be copied into:
```bash
alias ankim='open ~/Library/Application\ Support/Anki2/User\ 1/collection.media'
```

## Frontend (React)
The frontend is built with React and Typescript. The UI allows the user to enter words and phrases in the target language.

## Backend (Flask)
The Flask (Python) backend uses Beautiful Soup to scrape popular websites.

## Running Locally
1. Clone the repo with `git clone https://github.com/TBarmak/anki-lang.git`
2. `cd anki-lang`
3. Install the UI dependencies with `npm i`
4. `cd api`
5. Create a virtual env for python with `python -m venv env`
6. Activate the virtual environment with `source env/bin/activate`
7. Install the python dependencies in the virtual environment with `pip install -r requirements.txt`
8. In a new terminal, from the root of the repo, run `npm run start-api` to start the api.
9. In another terminal tab, run `npm run dev` to start the UI.
10. Open `http://localhost:5173/` in the browser!
