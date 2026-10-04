## ADDED Requirements

### Requirement: Linguee lookup endpoint
The system SHALL expose `GET /api/linguee/<target_lang>/<native_lang>/<word>` that scrapes Linguee for `word` in `target_lang` with translations into `native_lang`, and responds with JSON `{inputWord, scrapedWordData, url}` and the scraper's status code.

#### Scenario: Successful lookup
- **WHEN** a client requests `/api/linguee/français/english/macérer` and Linguee returns a results page
- **THEN** the response status is 200
- **AND** `inputWord` is `macérer`
- **AND** `scrapedWordData` is a non-empty list of entry dicts
- **AND** `url` is the Linguee URL that was fetched

### Requirement: Supported language pairs
The scraper SHALL accept the app language names `english`, `español`, `français`, `português` and `italiano` (case-insensitive) for both target and native language. Exactly one of the two languages MUST be `english`, because Linguee only offers English-to-X dictionaries.

#### Scenario: Non-English target with English native
- **WHEN** target is `español` and native is `english`
- **THEN** the scraper fetches the Linguee English–Spanish dictionary with Spanish as the query's source language

#### Scenario: English target with non-English native
- **WHEN** target is `english` and native is `français`
- **THEN** the scraper fetches the Linguee English–French dictionary with English as the query's source language

#### Scenario: Unsupported pair
- **WHEN** neither language is `english`, both are `english`, or either language is not in the supported list
- **THEN** the scraper makes no HTTP request and returns an empty list, an empty URL and status 400

### Requirement: Dictionary entries
For each exact-match lemma in Linguee's dictionary section, the scraper SHALL return one entry with `word` (the lemma), `pos` (Linguee's word-type label with non-breaking spaces normalized) and `translations` (the list of translation headwords, in page order).

#### Scenario: Word with multiple lemmas
- **WHEN** the page for `hablar` (Spanish) has the lemmas `hablar` (verb) and `hablar de algo` (verb)
- **THEN** `scrapedWordData` contains one dictionary entry for each lemma, in page order, each with its own `translations`

### Requirement: Related expressions
For each related-expression lemma in Linguee's "Examples" section of the dictionary, up to a fixed maximum of 5, the scraper SHALL return one entry with `expression` (the phrase) and `expressionMeaning` (its translations joined with `, `).

#### Scenario: Expressions are capped
- **WHEN** the page lists more than 5 related expressions
- **THEN** only the first 5 are returned as expression entries

### Requirement: Bilingual example sentences
For each row in Linguee's external-sources sentence table, up to a fixed maximum of 5, the scraper SHALL return one entry with `targetExampleSentences` containing the target-language sentence and `nativeExampleSentences` containing its native-language counterpart, each as a single-element list. Sentence text MUST include the full sentence, with hidden shortened parts restored, and MUST exclude source-site labels, `[...]` placeholders and tooltip/warning markup. Whitespace MUST be collapsed to single spaces.

#### Scenario: Sentence pair is aligned and clean
- **WHEN** a row contains a French sentence with a collapsed `[...]` tail and a `ricardocuisine.com` source label, plus its English translation
- **THEN** the returned entry's `targetExampleSentences[0]` is the full French sentence without `[...]` or the source label
- **AND** `nativeExampleSentences[0]` is the matching English sentence

#### Scenario: Sentences are capped
- **WHEN** the sentence table has more than 5 rows
- **THEN** only the first 5 rows are returned as sentence entries

### Requirement: Entry ordering
The scraper SHALL return entries in this order: dictionary entries, then expression entries, then sentence entries.

#### Scenario: Mixed results
- **WHEN** a page has lemmas, related expressions and sentence pairs
- **THEN** all dictionary entries come before all expression entries, which come before all sentence entries

### Requirement: Not found and upstream errors
The scraper SHALL return an empty list with status 404 when Linguee responds successfully but the page has no lemmas, no related expressions and no sentence pairs. It SHALL return an empty list with Linguee's status code when Linguee responds with a non-success status.

#### Scenario: Unknown word
- **WHEN** the query is `xqzjvw` and Linguee returns a 200 page with no results
- **THEN** the scraper returns an empty list, the fetched URL and status 404

#### Scenario: Rate limited or blocked
- **WHEN** Linguee responds with status 429 or 403
- **THEN** the scraper returns an empty list, the fetched URL and that same status

#### Scenario: Phrase with sentences but no dictionary entry
- **WHEN** the query is a multi-word phrase with no lemma but with sentence pairs
- **THEN** the scraper returns status 200 with only sentence (and any expression) entries

### Requirement: Resource registration
`LANGUAGE_RESOURCES` SHALL include a "Linguee" resource with route `api/linguee/`, args `["targetLang", "nativeLang", "word"]`, outputs `["word", "pos", "translations", "targetExampleSentences", "nativeExampleSentences", "expression", "expressionMeaning"]`, supported languages `english`, `español`, `français`, `português`, `italiano`, and a working `healthRoute`.

#### Scenario: Resource listed for a supported language
- **WHEN** a client requests `/api/resources/français`
- **THEN** the response includes a resource named "Linguee" with the route, args and outputs above
