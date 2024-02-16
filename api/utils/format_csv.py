FIELD_PRIORITY_RANKING = [
    "word",
    "pos",
    "definition",
    "translations",
    "targetExampleSentences",
    "nativeExampleSentences",
    "audioFilenames"
]


def create_csv_sides(word_data, card_format):
    front = word_data['inputWord']
    sides = [create_csv_side(word_data['scrapedWordData'], side_format)
             for side_format in card_format['sides'][1:]]
    return [front] + sides


def restructure_scraped_dict(scraped_word_data, fields):
    '''
    Restructures the list of entries to be grouped by word and/or part of speech, depending on which are included in the fields

    Parameters
    ------------

    Return
    ------------
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


def create_csv_side(scraped_word_data, side_format):
    '''
    Formats the scraped data for one side of the flashcard based on the format

    Parameters
    ------------
        scraped_word_data: list of scraped data (dicts)
        side_format: 

    Return
    ------------

    '''
    # Check if word or pos in side_format
    fields = side_format['fields']
    restructured_dict = restructure_scraped_dict(scraped_word_data, fields)

    blocks = []
    for key in restructured_dict.keys():
        formatted = [key] if key else []
        formatted += [format_entry(entry, fields)
                      for entry in restructured_dict[key]]
        blocks.append('<br>'.join(formatted))
    return '<br><br>'.join(blocks)


def format_entry(entry, fields):
    # Filter the entry to the fields that are in side_format and not null/empty
    filtered_entry = [[key, entry[key]]
                      for key in fields if entry.get(key) and key not in ['word', 'pos']]
    for field in filtered_entry:
        if field[0] == 'audioFilenames':
            field[1] = [f"[sound:{filename}]" for filename in field[1]]
    # Sort them based on a priority list
    sorted_entry_fields = sorted(
        filtered_entry, key=lambda x: FIELD_PRIORITY_RANKING.index(x[0]))
    entry_values = [field[1] for field in sorted_entry_fields]
    for i in range(len(entry_values)):
        if isinstance(entry_values[i], list):
            entry_values[i] = " ".join(entry_values[i])
    return "<br>".join(entry_values)
