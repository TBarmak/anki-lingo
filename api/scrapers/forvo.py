from bs4 import BeautifulSoup
import base64
import urllib.parse
from api.scrapers.http_client import fetch

# TODO: Give the user the option to pick the accent they want
LANGUAGE_TO_ABBV = {
    "english": "en_usa",
    "español": "es_es",
    "français": "fr",
    "português": "pt_br",
    "italiano": "it"
}

# Forvo blocks the default TLS fingerprint of the container's OpenSSL build, so
# all Forvo requests use curl_cffi browser impersonation (impersonate=True).
FORVO_HEADERS = {
    "Referer": "https://www.google.com/",
    "Upgrade-Insecure-Requests": "1",
}


def create_url(word: str, lang_abbv: str):
    url = f"https://forvo.com/word/{'_'.join(word.split())}/#{lang_abbv}"

    # For handling non-ascii characters
    split_url = urllib.parse.urlsplit(url)
    url_parts = list(split_url)
    url_parts[2] = urllib.parse.quote(url_parts[2])
    return urllib.parse.urlunsplit(url_parts)


def get_table(soup: BeautifulSoup, lang_abbv: str):
    uls = soup.find_all(
        "ul", {"class": f"pronunciations-list pronunciations-list-{lang_abbv}"})
    return uls[0]


def get_top_pronunciation_url(table):
    top_li = table.find_all("li")[0]
    play_div = top_li.find("div", {"class": "play"})
    on_click_function = play_div["onclick"]
    base64_audio = on_click_function.split(",")[2].replace("\"", "")
    decoded_link = base64.b64decode(
        base64_audio.encode("ascii")).decode("ascii")
    return "https://audio00.forvo.com/ogg/" + decoded_link


def download_audio(url: str, word: str, lang_abbv: str):
    response = fetch(url, headers=FORVO_HEADERS, impersonate=True)
    output_filename = f"pronunciation_{lang_abbv}_{'_'.join(word.split())}.ogg"
    with open("audio_files/" + output_filename, "b+w") as fh:
        fh.write(response.content)
    return output_filename


def scrape_forvo(word: str, language: str):
    lang_abbv = LANGUAGE_TO_ABBV[language.lower()]
    url = create_url(word, lang_abbv)
    try:
        response = fetch(url, headers=FORVO_HEADERS, impersonate=True)
    except Exception:
        return [], url, 500
    if not response.ok:
        return [], url, response.status_code
    try:
        soup = BeautifulSoup(response.content, "html.parser")
        table = get_table(soup, lang_abbv)
        pronunciation_url = get_top_pronunciation_url(table)
        output_filename = download_audio(pronunciation_url, word, lang_abbv)
        return [{"audioFilenames": [output_filename]}], url, response.status_code
    except Exception:
        return [], url, response.status_code
