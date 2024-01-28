def create_csv_back(scraped_data, export_fields):
	formatted_items = []
	field_selections = { field['name']: field['isSelected'] for field in export_fields}
	for definition in scraped_data:
		word = definition.get('word', '') if field_selections.get('word', False) else ''
		pos = definition.get('pos', '') if field_selections.get('pos', False) else ''
		defn = definition.get('definition', '') if field_selections.get('definition', False) else ''
		translations = definition.get('translations', '') if field_selections.get('translations', False) else []
		native_example_sentences = definition.get('nativeExampleSentences', '') if field_selections.get('nativeExampleSentences', False) else []
		target_example_sentences = definition.get('targetExampleSentences', '') if field_selections.get('targetExampleSentences', False) else []
		if word or pos or defn or translations or native_example_sentences or target_example_sentences:
			formatted_items.append(f"{word} {pos} {defn}<br>{', '.join(translations)}<br>{'<br>'.join(target_example_sentences)}<br>{'<br>'.join(native_example_sentences)}")
	return "<br><br>".join(formatted_items)