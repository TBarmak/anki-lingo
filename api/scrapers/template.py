# Template for creating scraping endpoints
from bs4 import BeautifulSoup
import requests

def create_url(word):
    pass

def parse_soup(soup):
    pass

def scrape_site(word):
    url = create_url(word)
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    return parse_soup(soup), url