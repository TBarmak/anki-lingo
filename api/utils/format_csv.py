def create_csv_sides(scraped_data, export_fields, num_sides):
	# TODO: Reduce unnecessary <br>
	sides_lists = [[""] for _ in range(num_sides)]
	for scraped_item in scraped_data:
		for side in sides_lists:
			if side[-1] != "":
				side.append("")
		fields = [field for field in export_fields if field.get('side', -1) > -1]
		for field in fields:
			value = scraped_item.get(field['value'], '')
			if isinstance(value, list):
				value = ", ".join(value)
			if value != '':
				sides_lists[field['side']][-1] += value + '<br>'
	sides_strings = ["<br>".join(string for string in side_list if string != "") for side_list in sides_lists]
	return sides_strings