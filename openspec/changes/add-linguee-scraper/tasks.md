## 1. Scraper module

- [x] 1.1 Create `api/scrapers/linguee.py` with `LANGUAGE_TO_SLUG`, `MAX_EXPRESSIONS = 5`, `MAX_SENTENCES = 5`
- [x] 1.2 Implement `create_url(word, target_slug, native_slug)` building `https://www.linguee.com/english-<other>/search?source=<target>&query=<quoted word>`
- [x] 1.3 Implement language-pair validation in `scrape_linguee`: return `([], "", 400)` with no request for unsupported or non-English pairs
- [x] 1.4 Implement `parse_lemmas(soup)` → dictionary entries `{word, pos, translations}` from `#dictionary .exact > .lemma`, normalizing `\xa0` in `pos`
- [x] 1.5 Implement `parse_expressions(soup)` → up to 5 `{expression, expressionMeaning}` entries from `#dictionary .example_lines .lemma`
- [x] 1.6 Implement `clean_sentence(wrap)` that removes source labels, placeholders and tooltip/warning nodes, keeps shortened text, and collapses whitespace without splitting highlighted words
- [x] 1.7 Implement `parse_sentences(soup)` → up to 5 entries `{targetExampleSentences: [left], nativeExampleSentences: [right]}` from `#result_table tr`
- [x] 1.8 Implement `scrape_linguee(word, target_lang, native_lang)`: fetch via `http_client.fetch`, pass non-OK status through, return 404 when all three parsers are empty, otherwise lemmas + expressions + sentences with status 200

## 2. API wiring

- [x] 2.1 Import `scrape_linguee` and add route `GET /api/linguee/<target_lang>/<native_lang>/<word>` in `api/api.py`
- [x] 2.2 Add the "Linguee" entry to `LANGUAGE_RESOURCES` (route, args, outputs, supportedLanguages, healthRoute `api/linguee/français/english/macérer`)
- [x] 2.3 Update `api/test_api.py` resource-set assertions to include "Linguee" for each supported language

## 3. Snapshot tests

- [x] 3.1 Save raw (unformatted) Linguee HTML mocks to `api/scrapers/tests/mocks/`: `linguee_macérer_fr_en.html`, `linguee_hablar_es_en.html`, `linguee_apple_en_fr.html`, `linguee_xqzjvw_fr_en.html` (no results)
- [x] 3.2 Generate expected outputs in `api/scrapers/tests/expected_outputs/` from the running API and hand-check them against the live pages (full sentences, no `[...]` or source labels, pairs aligned)
- [x] 3.3 Write `api/scrapers/tests/test_linguee.py`: `create_url` cases (fr→en, en→fr, multi-word), snapshot tests for each mock, 404 for no results, 403/429 passthrough, 400 for unsupported pairs (asserting no request made), and caps enforced

## 4. Verification

- [x] 4.1 Manually hit `/api/linguee/français/english/macérer` against live Linguee and confirm the output
- [x] 4.2 Run `npm run test-api` and confirm all tests pass
- [x] 4.3 Run `npm run lint` and confirm zero warnings
- [x] 4.4 Run `npm test` and confirm all tests pass
- [x] 4.5 Update the scraper list in `CLAUDE.md`/`README.md` to include Linguee
