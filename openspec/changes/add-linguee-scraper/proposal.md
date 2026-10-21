## Why

Learners want real-world example sentences with side-by-side translations on their cards, and the current resources give only a few hand-written dictionary examples per word. Linguee pairs a compact dictionary (word, part of speech, translations, related expressions) with dozens of bilingual sentence pairs from real texts. It works for every language the app supports and, unlike Reverso Context (which is behind an interactive Cloudflare challenge), it can be fetched with a plain HTTP request.

## What Changes

- New scraper module `api/scrapers/linguee.py` exposing `scrape_linguee(word, target_lang, native_lang)` that returns the standard `(entries, url, status_code)` tuple.
- New route `GET /api/linguee/<target_lang>/<native_lang>/<word>` in `api/api.py` returning `{inputWord, scrapedWordData, url}, status_code`.
- New `LANGUAGE_RESOURCES` entry "Linguee" with outputs `word`, `pos`, `translations`, `targetExampleSentences`, `nativeExampleSentences`, `expression`, `expressionMeaning`, and a `healthRoute`, so the resource appears in the UI for english, español, français, português and italiano.
- Snapshot tests with frozen Linguee HTML and expected JSON outputs.
- No frontend code changes: the UI is driven by `LANGUAGE_RESOURCES`.

## Capabilities

### New Capabilities
- `linguee-scraper`: Look up a word on Linguee for a target/native language pair and return dictionary entries, related expressions, and bilingual example sentences in the shared entry-dict format.

### Modified Capabilities
<!-- None: no existing specs in openspec/specs/. -->

## Impact

- **Code**: new `api/scrapers/linguee.py`; `api/api.py` (import, route, `LANGUAGE_RESOURCES` entry); new tests in `api/scrapers/tests/` plus mocks and expected outputs; `api/test_api.py` resource-list assertions, if they enumerate resources.
- **APIs**: one new GET endpoint; `api/resources/<language>` responses gain a "Linguee" entry.
- **Dependencies**: none new (uses `requests` + BeautifulSoup through the shared `http_client.fetch`).
- **Operational**: Linguee rate-limits by IP. Large batches from the production server may get 429/503 responses, which the frontend already records per-resource as errors without failing the batch.
