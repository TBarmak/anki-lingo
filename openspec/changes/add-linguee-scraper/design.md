## Context

The app has six scrapers, all following one pattern: a `scrape_<site>()` function in `api/scrapers/`, a Flask route in `api/api.py`, and a `LANGUAGE_RESOURCES` entry the UI reads. Reverso Context was the first choice for bilingual example sentences, but it sits behind an interactive Cloudflare Turnstile challenge that defeats plain requests, TLS impersonation and Playwright (headless and headed). Linguee offers similar sentence-pair data. A spike confirmed:

- `https://www.linguee.com/english-french/search?source=french&query=mac%C3%A9rer` returns 200 to a plain `requests` call with the shared `BROWSER_HEADERS`, with no challenge.
- Linguee dictionaries are always named `english-<lang>` and accept either side as the query source (`french-english/...` also works, but `english-<lang>` is the canonical form).
- Page structure (stable class names):
  - `#dictionary .exact > .lemma`: exact lemmas. Lemma text in `.tag_lemma .dictLink`, word type in `.tag_wordtype`, translations in `.translation .tag_trans .dictLink`.
  - `#dictionary .example_lines .lemma`: related expressions. Same inner structure; word type is in `.tag_type`.
  - `#result_table tr`: sentence pairs. `td.sentence.left` is the query-source language and `td.sentence.right2` is the other language. Each `.wrap` contains highlight `<b>` tags, `placeholder_*` (`[...]`) spans, `shortened_*` divs that hold the hidden part of the sentence, `source_url`/`source_url_spacer` labels, plus `behindLinkDiv`, `tooltip_help` and `warnSign*` noise.
  - An unknown word returns 200 with no lemmas and no rows.

## Goals / Non-Goals

**Goals:**
- Linguee scraper that matches the existing scraper contract and conventions, so no frontend change is needed.
- Clean, aligned target/native sentence pairs that render well on an Anki card.
- Snapshot tests consistent with `docs/Testing.md`.

**Non-Goals:**
- Audio. Linguee serves MP3 while the pipeline packages Forvo `.ogg` files, and Forvo already covers pronunciation.
- Non-English pairs (e.g. français↔español). Linguee doesn't offer them.
- Pagination or more than 5 sentences or expressions per word.
- Retry, backoff or caching for rate limits.
- Reverso Context, which is blocked as described above.

## Decisions

1. **Search URL instead of `/translation/<word>.html`.** URL: `https://www.linguee.com/english-<other>/search?source=<target>&query=<quote(word)>`. The search form handles multi-word phrases and either direction without guessing Linguee's slug rules (`+` vs `%20`, case). *Alternative:* the translation `.html` URL gives a nicer link, but its slugging is undocumented.

2. **Plain `requests` via `http_client.fetch()` (no `impersonate`).** Linguee doesn't fingerprint TLS today, and plain `requests` keeps tests on `requests_mock` like the other scrapers. *Alternative:* `impersonate=True` (curl_cffi) is a one-line switch if Linguee starts blocking, but it would need a different mocking approach in tests.

3. **One entry per sentence pair.** `format_entry` joins list values with a space, so packing 5 sentences into one entry's lists would produce an unreadable blob and lose the alignment between each sentence and its translation. A one-element list per entry renders as `target<br>native`, which keeps each pair together.

4. **Three entry shapes, in a fixed order:** dictionary `{word, pos, translations}` → expression `{expression, expressionMeaning}` → sentence `{targetExampleSentences, nativeExampleSentences}`. `restructure_scraped_dict` groups by `word`/`pos` only when those fields are on the card side. Entries without `word` fall into the `""` group, the same behavior as Michaelis expression entries today.

5. **Caps: `MAX_EXPRESSIONS = 5`, `MAX_SENTENCES = 5`** as module constants. Linguee pages carry 25+ expressions and 25+ sentences, and every one would end up on a single card. 5 keeps cards readable. These are easy to tune later.

6. **Sentence cleaning:** decompose noise nodes (`source_url`, `source_url_spacer`, `behindLinkDiv`, `placeholder_begin`, `placeholder_begin2`, `placeholder_end`, `placeholder_end2`, `tooltip_help`, `warnSign`, `warnSign2`), keep `shortened_*` text, `get_text(" ")`, then collapse whitespace. Then repair the spaces this adds inside highlighted words. Highlight `<b>` tags split words mid-token (e.g. `Lai<b>ss</b><b>e</b><b>r</b>`), so use `get_text("")` and add spaces only at the boundaries of block-level `div`s (`shortened_*`). The implementation verifies the output against the snapshot.

7. **Status codes:** unsupported pair → `([], "", 400)` (mirrors Word Reference); non-OK upstream → passthrough; OK but empty → 404 (mirrors Word Reference's no-table case).

8. **Language mapping:** `{"english": "english", "español": "spanish", "français": "french", "português": "portuguese", "italiano": "italian"}`. Pair slug = `english-<non-english side>`, and `source` = target language slug.

## Risks / Trade-offs

- **Anti-bot / rate limiting:** Linguee (owned by DeepL) throttles by IP, typically responding with 429 or a block page after a burst of requests. Large word batches from the EC2 host could trip it. → The scraper passes the status code through, and `getFlashcardData` already records per-resource errors without failing the batch. The health dot shows red when the server's IP is blocked. Browser-like `BROWSER_HEADERS` from `http_client` avoid the instant 403 that the default `python-requests` UA gets. If blocking becomes routine, the follow-ups are switching to `impersonate=True` and adding a per-host request delay.
- **robots.txt:** `User-agent: * Disallow: /`, the same as WordReference, which the app already scrapes. The file's explicit prohibition is on training MT systems, which this app doesn't do. Requests are on-demand, per word and user-initiated, not a crawl.
- **Resource shown for unsupported pairs:** the UI lists resources by target language only, so Linguee appears for e.g. target español + native português and returns 400. → The UI records it as a per-resource error, which is acceptable. A later change could add pair-aware filtering.
- **Markup drift:** class names could change. → Snapshot tests pin today's parsing, and the `healthRoute` gives a live signal.

## Migration Plan

Additive: a new route and a new resource entry. Deploy as usual. To roll back, revert the commit, which removes the resource from the UI.

## Open Questions

- Should the caps (5/5) be user-configurable later? Out of scope for now.
