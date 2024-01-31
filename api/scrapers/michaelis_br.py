from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup

def create_url(word):
    return f'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/{word}'

def get_soup(url):
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)
    # TODO: Look into adding a retry for a longer wait period
    driver.set_page_load_timeout(5)
    try:
        driver.get(url)
    except TimeoutException:
        pass
    finally:
        page_source = driver.page_source
        driver.quit()
    soup = BeautifulSoup(page_source, 'html.parser')
    return soup

def has_tag(row, tag):
    tags = [child.name for child in row.findChildren()]
    return tag in tags

def parse_acn_row(row):
    children = [child for child in row.children]
    sentence_index = len(children)
    for i in range(len(children)):
        if isinstance(children[i], str):
            continue
        
        tag = children[i].name
        # Remove the number from the front
        if tag == 'acn':
            children[i] = ""
        # Remove this tag
        elif tag == 'dr':
            children[i] = children[i].text
        # Indicate the start of the example sentence and remove the tag
        elif tag in ['abt', 'eu']:
            sentence_index = i
            children[i] = children[i].text 
        # Use the data-original-title because it provides more info
        elif tag in ['ra', 'abf']:
            children[i] = children[i]['data-original-title']
        # Remove the tag if it isn't a known tag
        else:
            children[i] = children[i].text
    definition = "".join(children[:sentence_index]).strip()
    sentence = "".join(children[sentence_index:]).strip()
    return {'definition': definition, 'targetExampleSentences': [sentence]}

def parse_ex_row(row):
    children = [child for child in row.children]
    expression = children[0].text.strip()
    definition = "".join([child.text for child in children[1:]]).strip()
    # TODO: Expressions should eventually be their own key, instead of being under "word"
    entry = {'word': expression, 'definition': definition}
    return entry

def parse_rows(rows):
    parsed_data = []
    word = ""
    pos = ""
    for row in rows:
        if has_tag(row, 'e1') or has_tag(row, 'ef'):
            word = row.text.strip()
        elif has_tag(row, 'cg'):
            pos = row.text.strip()
        elif has_tag(row, 'acn'):
            entry = parse_acn_row(row)
            entry['word'] = word
            entry['pos'] = pos
            parsed_data.append(entry)
        elif has_tag(row, 'ex'):
            entry = parse_ex_row(row)
            parsed_data.append(entry)
    return parsed_data

def scrape_michaelis(word):
    url = create_url(word)
    soup = get_soup(url)
    container = soup.find('div', {"class": "verbete bs-component"})
    rows = container.findChildren(recursive=False)
    parsed_rows = parse_rows(rows)
    return parsed_rows