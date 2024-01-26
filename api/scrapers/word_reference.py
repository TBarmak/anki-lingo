from bs4 import BeautifulSoup
import requests

def create_url(word, target_lang_abbv, native_lang_abbv):
    return f'https://www.wordreference.com/{target_lang_abbv}{native_lang_abbv}/{"%20".join(word.split())}'

def parse_first_table(table):
    '''
    Parses the table of "Principal Translations" table for part of speech, definitions, translations,
    and example sentences.

    Parameters
    ------------
        table: bs4.element.Tag
            The first table on the page with class WRD
    '''
    rows = table.find_all('tr')
    entries = []
    for row in rows:
        if row.get('class')[0] in ['odd', 'even']:
            # Rows with an id represent a new section
            if row.get('id'):
                entries.append({})
                entries[-1]['pos'] = row.find_all('td', {"class": "FrWrd"})[0].em.text
                entries[-1]['word'] = row.find_all('td', {"class": "FrWrd"})[0].strong.contents[0].strip()
                entries[-1]['definition'] = row.find_all('td')[1].text.strip()
                entries[-1]['translations'] = []
                entries[-1]['nativeExampleSentences'] = []
                entries[-1]['targetExampleSentences'] = []
            translation = row.find_all('td', {"class": "ToWrd"})
            if len(translation) > 0:
                try:
                    entries[-1]['translations'].append(translation[0].contents[0].strip())
                except:
                    entries[-1]['translations'].append('Translation Unavailable')
            to_example = row.find_all('td', {"class": "ToEx"})
            from_example = row.find_all('td', {"class": "FrEx"})
            # Replace is necessary for correct formatting of import csv
            if len(to_example) > 0:
                entries[-1]['nativeExampleSentences'].append(to_example[0].span.i.text.strip().replace("\n", ""))
            if len(from_example) > 0:
                entries[-1]['targetExampleSentences'].append(from_example[0].span.text.strip().replace("\n", ""))
    return entries

def scrape_word_reference(word, native_lang_abbv, target_lang_abbv):
    url = create_url(word, native_lang_abbv, target_lang_abbv)
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    tables = soup.find_all('table', {"class":"WRD"})
    if len(tables) > 0:
        return parse_first_table(tables[0])
    return []