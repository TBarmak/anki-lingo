FIELD_PRIORITY_RANKING = [
    "word",
    "pos",
    "definition",
    "translations",
    "targetExampleSentences",
    "nativeExampleSentences",
    "audioFilenames"
]


def restructure_scraped_dict(scraped_word_data: list[dict], fields: list[str]):
    '''
    Restructures the list of entries to be grouped by word and/or part of speech, depending on which are included in the fields

    Parameters
    ------------
        scraped_word_data: list[dict]
            a list of dicts representing entries for the word. The entries contain fields such as word, part of speech (pos), definition, translations, etc.
        fields: list[str]
            a list of the fields to include. These fields correspond to the keys in the scraped_word_data dict

    Return
    ------------
        restructured_dict: dict
            a dict where the keys are the word/pos, and the values are the entries for that word/pos combination
    '''
    restructure_key = [key for key in ['word', 'pos'] if key in fields]
    restructured_dict = {}
    for item in scraped_word_data:
        item_key = " ".join([item.get(key, "")
                            for key in restructure_key]).strip()
        if restructured_dict.get(item_key):
            restructured_dict[item_key].append(item)
        else:
            restructured_dict[item_key] = [item]
    return restructured_dict


def format_entry(entry: dict, fields: list[str]):
    '''
    Orders the values of the entry based on FIELD_PRIORITY_RANKING, and joins the values into a str.

    Paramaters
    ------------
        entry: dict
           An entry contains fields such as word, part of speech (pos), definition, translations, etc. 
        fields: list[str]   
            A list of fields to include for the entry. The fields correspond to the keys in the entry.

    Return
    ------------
        formatted_entry: str
            A string containing the values in the entry for the fields in the 'fields' argument
    '''
    # Filter the entry to the fields that are in side_format and not null/empty
    filtered_entry = [[key, entry[key]]
                      for key in fields if entry.get(key)]

    # Reformat audioFilenames and translations
    for field in filtered_entry:
        if field[0] == 'audioFilenames':
            field[1] = [f"[sound:{filename}]" for filename in field[1]]
        elif field[0] == 'translations':
            field[1] = ', '.join(field[1])

    # Sort them based on a priority list
    sorted_entry_fields = sorted(
        filtered_entry, key=lambda x: FIELD_PRIORITY_RANKING.index(x[0]))
    entry_values = [field[1] for field in sorted_entry_fields]
    for i in range(len(entry_values)):
        if isinstance(entry_values[i], list):
            entry_values[i] = " ".join(entry_values[i])
    formatted_entry = "<br>".join(entry_values)
    return formatted_entry


def create_csv_side(scraped_word_data: list[dict], side_format: dict):
    '''
    Formats the scraped data for one side of the flashcard based on the format

    Parameters
    ------------
        scraped_word_data: list[dict]
            A list of entries for the word
        side_format: 
            A dictionary with the key 'fields' and a list[str] value that contains the fields to include on the side of the flashcard

    Return
    ------------
        formatted_side: str
            A str containing the data for one side of a flashcard
    '''
    fields = side_format.get('fields', [])
    restructured_dict = restructure_scraped_dict(scraped_word_data, fields)

    text_blocks = []
    for key in restructured_dict.keys():
        formatted_entries = [key] if key else []
        for entry in restructured_dict[key]:
            fields = [field for field in fields if field not in ['word', 'pos']]
            formatted_entry = format_entry(entry, fields)
            if formatted_entry.strip():
                formatted_entries.append(formatted_entry)
        text_blocks.append('<br>'.join(formatted_entries))
    formatted_side = '<br><br>'.join(text_blocks)
    return formatted_side


def create_csv_sides(word_data: dict, card_format: dict):
    '''
    Creates the sides for the flashcard

    Parameters
    ------------
        word_data: dict
            A dict with two keys ('inputWord', 'scrapedWordData') containing the data to use in the flashcard
        card_format: dict
            A dict with key 'sides', and value containing a list of dicts indicating which fields to include on each side.
            Each dict in the list has key 'fields', and a list[str] value containing the fields that should go on that side of the flashcard.

    Return
    ------------
    '''
    front = word_data.get('inputWord', '')
    sides = [create_csv_side(word_data.get('scrapedWordData', []), side_format)
             for side_format in card_format['sides'][1:]]
    return [front] + sides
