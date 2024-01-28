from bs4 import BeautifulSoup
import base64
import urllib.request
import urllib.parse

LANGUAGE_TO_ABBV = {
    'english': 'en',
    'español': 'es',
    'français': 'fr',
    'português': 'pt'
}

def create_url(word, lang_abbv):
    url = f"https://forvo.com/word/{'_'.join(word.split())}/#{lang_abbv}"
    print(url)

    # For handling non-ascii characters
    split_url = urllib.parse.urlsplit(url)
    url_parts = list(split_url)
    url_parts[2] = urllib.parse.quote(url_parts[2])
    return urllib.parse.urlunsplit(url_parts)

def get_soup(word, lang_abbv):
    url = create_url(word, lang_abbv)
    opener = urllib.request.build_opener()
    opener.addheaders = [('User-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0')]
    urllib.request.install_opener(opener)
    page=urllib.request.Request(url) 
    infile=urllib.request.urlopen(page).read()
    data = infile.decode('UTF-8')
    soup = BeautifulSoup(data, "html.parser")
    return soup

def get_table(soup, lang_abbv):
    # TODO: This fails for languages with multiple accents (ie Brazilian Portuguese and Portuguese Portuguese)
    uls = soup.find_all('ul', {"class": f"pronunciations-list pronunciations-list-{lang_abbv}"})
    return uls[0]

def get_top_pronunciation_url(table):
    top_li = table.find_all('li')[0]
    play_div = top_li.find("div", {"class": "play"})
    on_click_function = play_div["onclick"]
    base64_audio = on_click_function.split(',')[2].replace('\'', "")
    decoded_link = base64.b64decode(base64_audio.encode('ascii')).decode('ascii')
    return "https://audio00.forvo.com/ogg/" + decoded_link

def download_audio(url, word, lang_abbv):
    url_request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    response = urllib.request.urlopen(url_request)
    output_filename = f"pronunciation_{lang_abbv}_{'_'.join(word.split())}.ogg"
    with open("audio_files/" + output_filename, 'b+w') as fh:
        fh.write(response.read())
    return output_filename

def scrape_forvo(word, lang):
    lang_abbv = LANGUAGE_TO_ABBV[lang.lower()]
    soup = get_soup(word, lang_abbv)
    table = get_table(soup, lang_abbv)
    url = get_top_pronunciation_url(table)
    output_filename = download_audio(url, word, lang_abbv)
    return [{'audioFilenames': [output_filename]}]