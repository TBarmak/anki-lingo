from bs4 import BeautifulSoup
import requests


def create_url(word):
    return f'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/{"%20".join(word.split())}'


def reformat_to_rows(children):
    rows = []
    current_row = []
    for child in children:
        if isinstance(child, str):
            # Only append if it contains non-whitespace characters
            if child.strip():
                current_row.append(child)
        elif child.name in ['br']:
            if current_row:
                rows.append(current_row)
            current_row = []
        # These tags represent new sections (ie EXPRESSÕES, INFORMAÇÕES COMPLEMENTARES, ETIMOLOGIA)
        elif child.name in ['sm', 'sx', 'sv']:
            if current_row:
                rows.append(current_row)
            current_row = []
            rows.append([child])
        else:
            current_row.append(child)
    if len(current_row) > 0:
        rows.append(current_row)
    return rows


def parse_acn_row(row):
    definition = ""
    sentences = []
    for item in row:
        if isinstance(item, str):
            definition += item
        elif item.name in ['abt', 'eu']:
            sentences.append(item.text.strip())
        elif item.name in ['dr', 'ra', 'rdr', 'rn', 'rmt']:
            definition += "<i>" + item.text + "</i>"
    # Clean up for definitions followed by sentences
    if definition.strip()[-3:] == ": .":
        definition = definition.strip()[:-3]
    entry = {'definition': definition.strip(
    ), 'targetExampleSentences': sentences}
    return entry


def parse_ex_row(row):
    expression = row[0].text
    definition = "".join([item.text for item in row[1:]])
    # TODO: "expression" should eventually become its own separate key
    entry = {'word': expression.strip(), 'definition': definition.strip()}
    return entry


def parse_ra_row(row):
    definition = row[0].text + row[1]
    entry = {'definition': definition}
    return entry


def parse_rows(rows):
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
        elif tag == 'ra':
            entry = parse_ra_row(row)
            entry['word'] = word.strip()
            entry['pos'] = pos.strip()
            entries.append(entry)
        elif tag == 'ex':
            entry = parse_ex_row(row)
            entries.append(entry)
        elif tag == None:
            entry = {'definition': row[0].strip(
            ), 'word': word.strip(), 'pos': pos.strip()}
            entries.append(entry)
        elif row[0].text in ['INFORMAÇÕES COMPLEMENTARES', 'ETIMOLOGIA']:
            break
    return entries


def scrape_michaelis(word):
    url = create_url(word)
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    container = soup.find('div', {"class": "verbete bs-component"})
    children = [child for child in container.children]
    rows = reformat_to_rows(children)
    parsed_rows = parse_rows(rows)
    return parsed_rows, url
