# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Fullstack app that scrapes language-learning sites (WordReference, SpanishDict, Forvo, Michaelis BR, Semanticar BR, Larousse FR) to generate a CSV + audio bundle importable into Anki. React/TypeScript frontend, Flask/Python backend, BeautifulSoup scraping. Hosted at https://anki.taylorbarmak.com.

## Commands

Frontend (run from repo root):
- `npm i` — install UI deps
- `npm run dev` — start Vite dev server (proxies `/api` → `http://127.0.0.1:5000`)
- `npm run build` — `tsc && vite build`
- `npm run lint` — eslint, **zero warnings allowed** (`--max-warnings 0`)
- `npm test` — vitest (jsdom env)
- single test: `npx vitest run src/path/to/file.spec.ts` or `npx vitest -t "test name"`

Backend (Python venv lives at `api/env`):
- setup: `cd api && python -m venv env && source env/bin/activate && pip install -r requirements.txt`
- `npm run start-api` — runs `cd api && env/bin/flask run --no-debugger` (port 5000)
- `npm run test-api` — runs `api/env/bin/pytest` (full suite)
- single test: `api/env/bin/pytest api/scrapers/tests/test_word_reference.py`

Docker: `docker-compose up` → UI at `localhost:8080`. Note some sites block traffic from the Docker network.

## Architecture

### Request flow (frontend → backend → CSV)
1. **ResourceForm** (`src/components/forms/resource-form/`) — user picks native/target language and words. On language select, frontend fetches `api/resources/<language>` for available resources, then pings each resource's `healthRoute` to show green/red health dots.
2. **getFlashcardData** (`src/components/forms/utils/getFlashcardData.ts`) — fan-out scraper. For each word × each selected resource, builds the URL by joining `resource.route` with `resource.args` mapped through `{word, targetLang, nativeLang}`, fetches, and merges all results per word into a `CombinedScrapedResponse` (collecting `urls` and per-resource `errors`). A failed resource degrades gracefully (recorded in `errors`, not thrown).
3. **CardFormatForm** (`src/components/forms/card-format-form/`) — drag-and-drop (`@dnd-kit`) UI to assign fields to card sides. Produces a `cardFormat` = `{ sides: [{ fields: [...] }] }`.
4. **Download** — POSTs `{ scrapedData, cardFormat }` to `api/format-csv`, gets back a zip, downloads as `anki-lingo-<timestamp>.zip`.

`src/pages/Main.tsx` is a state machine driven by Redux: `isLoading` → Loading, `downloadUrl` → Download, `scrapedData.length` → CardFormatForm, else ResourceForm. Global state in `src/store/rootSlice.ts` (Redux Toolkit): `scrapedData`, `cardFormat`, `exportFields`, `downloadUrl`, `isLoading`.

### Backend (`api/api.py`)
`create_app()` defines all routes. Two driving constants:
- **`LANGUAGE_RESOURCES`** — the source of truth for what the frontend sees. Each entry's `route`, `args`, `outputs`, `supportedLanguages`, `healthRoute` flow to the UI via `api/resources/<language>`.
- **`FLASHCARD_FIELDS`** — maps internal field keys to display labels (`api/field-mapping`).

Each scraper has one route (e.g. `api/wr/<target>/<native>/<word>`) returning `{inputWord, scrapedWordData, url}, status_code`. `api/format-csv` (POST) writes audio `.ogg` files from `api/audio_files/` plus an `anki.csv` into a zip under `api/zip_files/` (named by sha256 of the request), then `send_file`s it.

### Scrapers (`api/scrapers/`)
Each module exposes `scrape_<site>(...)` returning `(list_of_entry_dicts, url, status_code)`. Entry dicts use a subset of these keys (the shared field contract across frontend types, scrapers, and CSV formatting):
`word, pos, definition, translations[], targetExampleSentences[], nativeExampleSentences[], audioFilenames[], expression, expressionMeaning`.
`template.py` is the starting skeleton. Scrapers set browser-like `HEADERS` to avoid 403s (see `word_reference.py`).

### CSV formatting (`api/utils/format_csv.py`)
Turns scraped entries + `cardFormat` into pipe-delimited rows.
- `create_csv_sides` — front side is the input word; `cardFormat.sides[1:]` become the back sides. Source `urls` are appended (as clickable `<a>` links) to the first back side.
- `restructure_scraped_dict` — groups entries by `word`/`pos` if those fields are on the side.
- `format_entry` — orders fields by `FIELD_PRIORITY_RANKING`, joins with `<br>`, wraps audio as `[sound:filename]` and translations as comma-joined.
- Output is `|`-separated columns, `\n`-separated rows → **Anki import uses Pipe separator + Allow HTML on**.

## Scraper tests (snapshot-based)
Sites are dynamic, so scrapers are tested against frozen HTML snapshots in `api/scrapers/tests/mocks/`, mocked via `requests_mock`, asserting against expected JSON in the `expected_outputs/` folder. See `docs/Testing.md` for the workflow to create/refresh mocks and expected outputs. The health-check routes in `LANGUAGE_RESOURCES` are the live signal that a site's structure changed and broke a scraper.

## Adding a new scraper
Full steps in `docs/CreatingNewScrapingEndpoint.md`. Summary: copy `template.py`, implement `create_url`/parsing returning the entry-dict contract above, add a route in `api.py`, append an entry to `LANGUAGE_RESOURCES`, then add a snapshot test.
