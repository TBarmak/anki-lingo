import re
from bs4 import BeautifulSoup
from urllib.parse import quote
from api.scrapers.http_client import fetch

LANGUAGE_TO_SLUG = {
    "english": "english",
    "español": "spanish",
    "français": "french",
    "português": "portuguese",
    "italiano": "italian"
}

MAX_EXPRESSIONS = 5
MAX_SENTENCES = 5

# Markup inside a sentence cell that is not part of the sentence itself
SENTENCE_NOISE_CLASSES = [
    "source_url",
    "source_url_spacer",
    "behindLinkDiv",
    "placeholder_begin",
    "placeholder_begin2",
    "placeholder_end",
    "placeholder_end2",
    "tooltip_help",
    "warnSign",
    "warnSign2"
]


def create_url(word, target_slug, native_slug):
    # Linguee dictionaries are always named english-<other language>
    other_slug = native_slug if target_slug == "english" else target_slug
    return f"https://www.linguee.com/english-{other_slug}/search?source={target_slug}&query={quote(word)}"


def clean_text(text):
    return re.sub(r"\s+", " ", text.replace("\xa0", " ")).strip()


def parse_translations(lemma):
    return [link.text.strip() for link in lemma.select(".translation .tag_trans .dictLink")]


def parse_lemmas(soup):
    '''
    Parses the exact-match dictionary lemmas for the word, part of speech and translations.

    Parameters
    ------------
        soup: bs4.BeautifulSoup
            The parsed Linguee search page
    '''
    entries = []
    for lemma in soup.select("#dictionary .exact > .lemma"):
        word = lemma.select_one(".tag_lemma .dictLink")
        pos = lemma.select_one(".tag_lemma .tag_wordtype")
        entries.append({
            "word": clean_text(word.text) if word else "",
            "pos": clean_text(pos.text) if pos else "",
            "translations": parse_translations(lemma)
        })
    return entries


def parse_expressions(soup):
    '''
    Parses the related expressions listed under "Examples" in the dictionary section.

    Parameters
    ------------
        soup: bs4.BeautifulSoup
            The parsed Linguee search page
    '''
    entries = []
    for lemma in soup.select("#dictionary .example_lines .lemma")[:MAX_EXPRESSIONS]:
        expression = lemma.select_one(".tag_lemma .dictLink")
        if not expression:
            continue
        entries.append({
            "expression": clean_text(expression.text),
            "expressionMeaning": ", ".join(parse_translations(lemma))
        })
    return entries


def clean_sentence(wrap):
    '''
    Extracts the full sentence text from a sentence cell, dropping source labels, [...] placeholders
    and tooltips, and restoring the shortened parts of the sentence.

    Parameters
    ------------
        wrap: bs4.element.Tag
            The div with class "wrap" inside a sentence cell
    '''
    for noise in wrap.find_all(class_=SENTENCE_NOISE_CLASSES):
        noise.decompose()
    # Highlight <b> tags split words mid-token, so join inline text without separators and
    # only add spaces around the block-level shortened_* divs
    for div in wrap.find_all("div"):
        div.insert_before(" ")
        div.insert_after(" ")
    return clean_text(wrap.get_text(""))


def parse_sentences(soup):
    '''
    Parses the bilingual example sentences from external sources.

    Parameters
    ------------
        soup: bs4.BeautifulSoup
            The parsed Linguee search page
    '''
    entries = []
    for row in soup.select("#result_table tr"):
        target = row.select_one("td.sentence.left .wrap")
        native = row.select_one("td.sentence.right2 .wrap")
        if not target or not native:
            continue
        entries.append({
            "targetExampleSentences": [clean_sentence(target)],
            "nativeExampleSentences": [clean_sentence(native)]
        })
        if len(entries) == MAX_SENTENCES:
            break
    return entries


def scrape_linguee(word, target_lang, native_lang):
    target_slug = LANGUAGE_TO_SLUG.get(target_lang.lower())
    native_slug = LANGUAGE_TO_SLUG.get(native_lang.lower())
    if not target_slug or not native_slug or target_slug == native_slug or "english" not in [target_slug, native_slug]:
        return [], "", 400

    url = create_url(word, target_slug, native_slug)
    response = fetch(url)
    if not response.ok:
        return [], url, response.status_code
    soup = BeautifulSoup(response.text, "html.parser")
    entries = parse_lemmas(soup) + parse_expressions(soup) + parse_sentences(soup)
    if not entries:
        return [], url, 404
    return entries, url, response.status_code
