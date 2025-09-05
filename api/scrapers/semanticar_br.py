from bs4 import BeautifulSoup
import requests
from urllib.parse import quote
import json


def create_url(word):
    return f"https://www.semanticar.com.br/{quote(word)}"


def get_sentences_and_definitions(word, soup):
    next_data = soup.find("script", {"id": "__NEXT_DATA__"}).text
    sentence_objects = json.loads(next_data)[
        "props"]["pageProps"]["initialSentences"]
    parsed_sentences = [{"targetExampleSentences": [sent_obj["before"] + sent_obj["match"] + sent_obj["after"]]}
                 for sent_obj in sentence_objects]
    definitions = json.loads(next_data)["props"]["pageProps"]["definitions"]
    parsed_definitions = [{"definition": definition} for definition in definitions]
    return parsed_sentences + parsed_definitions


def scrape_semanticar(word):
    url = create_url(word)
    response = requests.get(url)
    if response.ok:
        soup = BeautifulSoup(response.text, "html.parser")
        scraped_data = get_sentences_and_definitions(word, soup)
        return scraped_data, url, response.status_code
    else:
        return [], url, response.status_code
