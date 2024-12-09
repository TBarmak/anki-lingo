from bs4 import BeautifulSoup
import requests
from urllib.parse import quote

LANGUAGE_TO_ABBV = {
    "english": "en",
    "español": "es"
}


def create_url(word, target_lang_abbv):
    return f"https://www.spanishdict.com/translate/{quote(word)}?langFrom={target_lang_abbv}"


def parse_pos_block(pos_block, target_lang_abbv):
    '''
    Parses a part of speech block and returns a list of dicts containing parsed translations and example sentences.

    Parameters
    ------------
        pos_block: bs4.element.Tag
            refers to a div with a part of speech at the top. This div contains numbered translations and lettered subtranslations with example sentences in both English and Spanish.
        target_lang_abbv: string
            abbreviation of the language of the word being scraped. Either "en" (for English) or "es" (for Español) 

    Return
    ------------
        parsed_translation_blocks: dict
            dict containing the keys:
                pos (string): part of speech for the translation
                translations (list): list of string translations that are closely related
                targetExampleSentences (list): list of string example sentences in the target language
                nativeExampleSentences (list): list of string example sentences in the native language 
    '''
    pos = pos_block.findChildren(recursive=False)[0].find("a").contents[0]

    translation_blocks = pos_block.findChildren(
        recursive=False)[1].findChildren(recursive=False)
    parsed_translation_blocks = [parse_translation_block(
        block, target_lang_abbv) for block in translation_blocks]
    for parsed_translation_block in parsed_translation_blocks:
        parsed_translation_block["pos"] = pos
    return parsed_translation_blocks


def parse_translation_block(translation_block, target_lang_abbv):
    '''
    Parses a translation block and returns a dict. The values for the dict are lists that result from consolidating the values from the subblocks.

    Parameters
    ------------
        translation_block: bs4.element.Tag
            refers to a div with a number and a parenthesized translation at the top. They contain one or more lettered sub-translations with example sentences in both English and Spanish.
        target_lang_abbv: string
            abbreviation of the language of the word being scraped. Either "en" (for English) or "es" (for Español) 

    Return
    ------------
        parsed_translation_block: dict
            dict containing the keys:
                translations (list): list of string translations that are closely related
                targetExampleSentences (list): list of string example sentences in the target language
                nativeExampleSentences (list): list of string example sentences in the native language 
    '''
    parenthesized_translations = "".join(
        [item.text for item in translation_block.findChildren(recursive=False)[0].findAll("a")])

    translation_subblocks = translation_block.findChildren(
        recursive=False)[1].findChildren(recursive=False)
    parsed_translation_subblocks = [parse_translation_subblock(
        subblock, target_lang_abbv) for subblock in translation_subblocks]
    parsed_translation_block = {}
    for parsed_subblock in parsed_translation_subblocks:
        for key, value in parsed_subblock.items():
            if key not in parsed_translation_block:
                parsed_translation_block[key] = value.copy()
            else:
                parsed_translation_block[key].extend(value)
    parsed_translation_block["translations"].append(parenthesized_translations)
    return parsed_translation_block


def parse_translation_subblock(translation_subblock, target_lang_abbv):
    '''
    Parses a translation subblock and returns a dict.

    Parameters
    ------------
        translation_subblock: bs4.element.Tag
            refers to a div with a letter and a subtranslation in blue text. It also contains the example sentences for the translation.
        target_lang_abbv: string
            abbreviation of the language of the word being scraped. Either "en" (for English) or "es" (for Español) 

    Return
    ------------
        parsed_tranlsation_sublock: dict
            dict containing the keys:
                translations (list): list of string translations that are closely related
                targetExampleSentences (list): list of string example sentences in the target language
                nativeExampleSentences (list): list of string example sentences in the native language 
    '''
    native_lang_abbv = "en" if target_lang_abbv == "es" else "en"
    translation = translation_subblock.findChildren(
        recursive=False)[0].find("a").contents[0]
    example_sentences = translation_subblock.findChildren(recursive=False)[
        0].findChildren(recursive=False)[0].findChildren(recursive=False)[-1].findChildren(recursive=False)[0]
    target_example_sentence = example_sentences.find(
        "span", {"lang": target_lang_abbv}).contents[0]
    native_example_sentence = example_sentences.find(
        "span", {"lang": native_lang_abbv}).contents[0]
    parsed_translation_subblock = {"translations": [translation], "targetExampleSentences": [
        target_example_sentence], "nativeExampleSentences": [native_example_sentence]}
    return parsed_translation_subblock


def scrape_spanishdict(word, target_lang):
    '''
    Scrapes SpanishDict and returns a list of dicts where each dict is the scraped data for a translation.

    Parameters
    ------------
        word: string
            word (in English or Spanish) to scrape SpanishDict for
        target_lang: string
            language of the word being scraped. Either English or Español

    Return
    ------------
        url: str
            the url of the page that was scraped
        translations_list: list
            list of dicts where each dict represents a translation of the word.
            Keys of the dicts: 
                word (string): word in the target language being translated
                pos (string): part of speech for the translation
                translations (list): list of string translations that are closely related
                targetExampleSentences (list): list of string example sentences in the target language
                nativeExampleSentences (list): list of string example sentences in the native language
    '''
    target_lang_abbv = LANGUAGE_TO_ABBV[target_lang.lower()]
    url = create_url(word, target_lang_abbv)
    response = requests.get(url)
    if response.ok:
        soup = BeautifulSoup(response.text, "html.parser")
        meanings_container = soup.find(
            "div", {"id": f"dictionary-neodict-{target_lang_abbv}"})

        # Extract the word from SpanishDict in case it differs from the word submitted (ie due to a typo)
        spanishdict_word = meanings_container.findChildren(
            recursive=False)[0].findChildren(recursive=False)[0].find("span").contents[0]
        pos_blocks = meanings_container.findChildren(
            recursive=False)[0].findChildren(recursive=False)[0].findChildren(recursive=False)[1:]
        parsed_pos_blocks = [parse_pos_block(
            block, target_lang_abbv) for block in pos_blocks]
        translations_list = []
        for parsed_pos_block in parsed_pos_blocks:
            translations_list += parsed_pos_block
        for item in translations_list:
            item["word"] = spanishdict_word
        return translations_list, url, response.status_code
    else:
        return [], url, response.status_code
