from bs4 import BeautifulSoup
import requests


def create_url(word):
    return f'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/{"%20".join(word.split())}'


def reformat_to_rows(children):
    '''
    Converts the list of individual children into a list of lists based on the <br/> tag

    Parameters
    ------------
        children: list of str and/or bs4.element.Tag
            a list of the children of the main container

    Return
    ------------
        rows: list of lists of str and/or bs4.element.Tag
            a list of lists of the children separated into rows based on the <br/> tag
    '''
    rows = []
    current_row = []
    for child in children:
        if isinstance(child, str):
            # Only append if it contains non-whitespace characters
            if child.strip():
                current_row.append(child)
        elif child.name in ['br', 'sx', 'sm']:
            if current_row:
                rows.append(current_row)
            current_row = []
        else:
            current_row.append(child)
    if len(current_row) > 0:
        rows.append(current_row)
    return rows


def parse_acn_row(row):
    '''
    Parses a row that starts with an <acn>. These are the numbered definitions.

    Parameters
    ------------
        row: list of str and/or bs4.element.Tag

    Return
    ------------
        entry: dict (str -> str) with keys 'word' and 'definition'
    '''
    definition = ""
    sentences = []
    for item in row:
        if isinstance(item, str):
            definition += item
        elif item.name in ['abt', 'eu']:
            sentences.append(item.text.strip())
        elif item.name in ['dr', 'ra', 'rdr', 'rn']:
            definition += item.text
    entry = {'definition': definition.strip(
    ), 'targetExampleSentences': sentences}
    return entry


def parse_ex_row(row):
    '''
    Parses a row that starts with an <ex>. These are expressions containing the target word.

    Parameters
    ------------
        row: list of str and/or bs4.element.Tag

    Return
    ------------
        entry: dict (str -> str) with keys 'word' and 'definition'
    '''
    expression = row[0].text
    definition = "".join([item.text for item in row[1:]])
    # TODO: "expression" should eventually become its own separate key
    entry = {'word': expression.strip(), 'definition': definition.strip()}
    return entry


def parse_rows(rows):
    '''
    Parse the rows and convert them to entries containing word, part of speech, 
    definition, and example sentences

    Parameters
    ------------
        rows: list of lists of str and/or bs4.element.Tag 
            the reformatted rows in the container

    Return
    ------------
        entries: list of dicts with keys: 'word', 'pos', 'definition', and 'targetExampleSentences'
    '''
    entries = []
    word = ""
    pos = ""
    for row in rows:
        tag = row[0].name
        if tag in ['e1', 'ef']:
            word = row[0].text
        elif tag == 'cg':
            pos = " ".join(tag.text for tag in row)
        elif tag == 'acn':
            entry = parse_acn_row(row)
            entry['word'] = word.strip()
            entry['pos'] = pos.strip()
            entries.append(entry)
        elif tag == 'ex':
            entry = parse_ex_row(row)
            entries.append(entry)
    return entries


def scrape_michaelis(word):
    '''
    Scrapes the data from the Brazilian Portuguese dictionary Michaelis

    Parameters
    ------------
        word: str
            a word in Brazilian Portuguese

    Return
    ------------
        parsed_rows: list of dicts with keys: 'word', 'pos', 'definition', and 'targetExampleSentences' 
    '''
    url = create_url(word)
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    container = soup.find('div', {"class": "verbete bs-component"})
    children = [child for child in container.children]
    rows = reformat_to_rows(children)
    parsed_rows = parse_rows(rows)
    return parsed_rows, url
