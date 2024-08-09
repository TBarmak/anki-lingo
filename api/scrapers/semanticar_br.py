from bs4 import BeautifulSoup
import requests
from urllib.parse import quote
import json


def create_url(word):
    return f'https://www.semanticar.com.br/{quote(word)}'


def get_sentences(word, soup):
    sentence_data = soup.find("script", {"id": "__NEXT_DATA__"}).text
    sentence_objects = json.loads(sentence_data)[
        'props']['pageProps']['sentences']
    sentences = [{"targetExampleSentences": [word.join(sent_obj['sentence'])]}
                 for sent_obj in sentence_objects]
    return sentences


def scrape_semanticar(word):
    url = create_url(word)
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    sentence_objects = get_sentences(word, soup)
    return sentence_objects, url
