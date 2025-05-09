from bs4 import BeautifulSoup
import requests
from urllib.parse import quote

LANGUAGE_TO_ABBV = {
    "english": "en",
    "español": "es",
    "français": "fr",
    "português": "pt",
    "italiano": "it"
}


def create_url(word, target_lang_abbv, native_lang_abbv):
    return f"https://www.wordreference.com/{target_lang_abbv}{native_lang_abbv}/{quote(word)}"


def parse_first_table(table):
    '''
    Parses the table of "Principal Translations" table for part of speech, definitions, translations,
    and example sentences.

    Parameters
    ------------
        table: bs4.element.Tag
            The first table on the page with class WRD
    '''
    rows = table.find_all("tr")
    entries = []
    entry = {}
    for row in rows:
        if row.get("class")[0] in ["odd", "even"]:
            # Rows with an id represent a new section in the table
            if row.get("id"):
                # Add the entry dict to the list of entries, and start a new entry
                if entry:
                    entries.append(entry)
                    entry = {}
                entry["pos"] = row.find_all(
                    "td", {"class": "FrWrd"})[0].em.text
                entry["word"] = "".join(row.find_all("td", {"class": "FrWrd"})[
                                        0].strong.find_all(string=True))
                entry["definition"] = row.find_all("td")[1].text.strip()
                entry["translations"] = []
                entry["nativeExampleSentences"] = []
                entry["targetExampleSentences"] = []
            translation = row.find_all("td", {"class": "ToWrd"})
            if len(translation) > 0:
                try:
                    entry["translations"].append(
                        translation[0].contents[0].strip())
                except:
                    entry["translations"].append("Translation Unavailable")
            to_example = row.find_all("td", {"class": "ToEx"})
            from_example = row.find_all("td", {"class": "FrEx"})
            # Replace is necessary for correct formatting of import csv
            if len(to_example) > 0:
                entry["nativeExampleSentences"].append(
                    to_example[0].text.strip().replace("\n", ""))
            if len(from_example) > 0:
                entry["targetExampleSentences"].append(
                    from_example[0].text.strip().replace("\n", ""))
    if entry:
        entries.append(entry)
    return entries


def scrape_word_reference(word, target_lang, native_lang):
    native_lang_abbv = LANGUAGE_TO_ABBV.get(native_lang.lower())
    target_lang_abbv = LANGUAGE_TO_ABBV.get(target_lang.lower())
    if not native_lang_abbv or not target_lang_abbv:
        return [], "", 400

    url = create_url(word, target_lang_abbv, native_lang_abbv)
    response = requests.get(url)
    if response.ok:
        soup = BeautifulSoup(response.text, "html.parser")
        tables = soup.find_all("table", {"class": "WRD"})
        if len(tables) > 0:
            return parse_first_table(tables[0]), url, response.status_code
        return [], url, 404
    else:
        return [], url, response.status_code
