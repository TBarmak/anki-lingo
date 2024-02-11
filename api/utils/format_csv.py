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


def create_csv_side(scraped_word_data, side_format):
    formatted_entries = [format_entry(entry, side_format)
                         for entry in scraped_word_data]
    separator = "<br><br>" if side_format['useWhitespace'] else "<br>"
    return separator.join(formatted_entries)


def format_entry(entry, side_format):
    # Filter the entry to the fields that are in side_format and not null/empty
    filtered_entry = [[key, entry[key]]
                      for key in side_format['fields'] if entry.get(key)]
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
