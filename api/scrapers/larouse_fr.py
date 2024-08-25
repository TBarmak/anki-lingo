from bs4 import BeautifulSoup, NavigableString
import requests
from urllib.parse import quote


def create_url(word):
    return f"https://www.larousse.fr/dictionnaires/francais/{quote(word)}"


def parse_entry(entry):
    predef = entry.find('p', {"class": "RubriqueDefinition"})
    definition = " ".join([child for child in entry.children if isinstance(
        child, NavigableString)]).strip().replace('\xa0', ' ')
    exampleSentenceElements = entry.find_all(
        'span', {"class": "ExempleDefinition"})
    exampleSentences = [exampleSentenceElement.text.strip().replace(
        '\xa0', ' ') for exampleSentenceElement in exampleSentenceElements]
    if predef:
        definition = f'({predef.text}) {definition}'
    return {'definition': definition, "targetExampleSentences": exampleSentences}


def parse_soup(soup):
    entries = soup.find("ul", {"class": "Definitions"}).find_all('li')
    return [parse_entry(entry) for entry in entries]


def scrape_larouse(word):
    url = create_url(word)
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    return parse_soup(soup), url
