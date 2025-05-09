from bs4 import BeautifulSoup
import base64
import urllib.request
import urllib.parse
import requests

# TODO: Give the user the option to pick the accent they want
LANGUAGE_TO_ABBV = {
    "english": "en_usa",
    "español": "es_es",
    "français": "fr",
    "português": "pt_br",
    "italiano": "it"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": "https://www.google.com/",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
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
    url_request = urllib.request.Request(
        url, headers=headers)
    response = urllib.request.urlopen(url_request)
    output_filename = f"pronunciation_{lang_abbv}_{'_'.join(word.split())}.ogg"
    with open("audio_files/" + output_filename, "b+w") as fh:
        fh.write(response.read())
    return output_filename


def scrape_forvo(word: str, language: str):
    lang_abbv = LANGUAGE_TO_ABBV[language.lower()]
    url = create_url(word, lang_abbv)
    url_request = urllib.request.Request(
        url, headers=headers)
    try:
        response = urllib.request.urlopen(url_request)
        content = response.read()
        soup = BeautifulSoup(content, "html.parser")
        table = get_table(soup, lang_abbv)
        pronunciation_url = get_top_pronunciation_url(table)
        output_filename = download_audio(pronunciation_url, word, lang_abbv)
        return [{"audioFilenames": [output_filename]}], url, response.getcode()
    except urllib.error.HTTPError as e:
        return [], url, e.code
    except urllib.error.URLError as e:
        return [], url, 500
    
