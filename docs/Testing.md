# Testing Scraping Functions
Since the websites that are being scraped are dynamic, I test the code against a snapshot of the website in time. I store a copy of the HTML, and validate that the parsed input is as expected.

## Writing Tests
### Creating/Refreshing Mocks
1. `cd` into the `api/scrapers/tests/mocks` folder.
2. Call `python3` to run a python shell in the terminal.
3. In the python shell, `import requests`.
4. Copy the `create_url` function from the file you are trying to test, and paste it into the shell. Also, import any necessary libraries. For example,
```python
def create_url(word, target_lang_abbv, native_lang_abbv):
    return f'https://www.wordreference.com/{target_lang_abbv}{native_lang_abbv}/{"%20".join(word.split())}'
```
5. Call the function to get the url:
```python
url = create_url(...)
```
6. Fetch the response:
```python
r = requests.get(url)
```
7. Write the response to a mocks file:
```python
with open('<filename>.html', 'w') as f:
    f.write(r.text)
```
- Make sure to not format the HTML file after it's created. Doing so can mess up the response.

### Creating Expected Response
1. Start running the api locally with `npm run start-api` 
2. `cd` into the `expected_outputs` folder.
3. Store the api expected response in a file using a curl command. Here is an example:
```python
curl -s http://localhost:5000/api/<endpoint path> | python3 -c "import sys, json; print(json.dumps(json.loads(sys.stdin.read())['scrapedWordData'], ensure_ascii=False))" > <filename>.json
```
4. Compare the output against the information on the site you are scraping to ensure that all information was captured.

### Writing the test
The tests for scraping functions follow a similar structure.

1. Start by defining a function in the test class with an appropriate name. Make sure that it accepts the `self` argument, and the `requests_mock` argument. Example:
```python
def test_scrape_word_reference_abacaxi(self, requests_mock):
```
2. Create the `# Arrange` section to set the variables. Example
```python
    # Arrange
    word = 'abacaxi'
    target_lang = 'Português'
    native_lang = 'English'
```
3. Set up the mock response:
```python
    current_dir = os.path.dirname(os.path.abspath(__file__))
    mock_file_path = os.path.join(
        current_dir, 'mocks', 'wr_abacaxi_pt_en.html')
    response = ""
    with open(mock_file_path, 'r') as f:
        response = f.read()
    requests_mock.get(
        f'https://www.wordreference.com/pten/{word}', text=response)
```
4. Parse the expected output:
```python
    expected_response = read_expected_output(
        'wr_abacaxi_pt_en_output.json')
```
5. In the `# Act` section, call the function:
```python
    # Act
    scraped_data, url = scrape_word_reference(
        word, target_lang, native_lang)
```
6. In the `# Assert` section, assert that the response and url are correct
```python
    # Assert
    assert scraped_data == expected_response
    assert url == f'https://www.wordreference.com/pten/{word}'
```