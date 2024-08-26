from api.utils.format_csv import create_csv_side, create_csv_sides, format_entry, restructure_scraped_dict


class TestFormatCsv:
    def test_restructure_scraped_dict_word_and_pos(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "",
                "nativeExampleSentences": [],
                "pos": "sm",
                "targetExampleSentences": [],
                "translations": [
                    "man"
                ],
                "word": "homem"
            },
            {
                "definition": "(ser humano)",
                "nativeExampleSentences": [],
                "pos": "sm",
                "targetExampleSentences": [],
                "translations": [
                    "man",
                    "person",
                    "human",
                    "human being"
                ],
                "word": "homem"
            },
            {
                "definition": "A humanidade.",
                "pos": "sm pl",
                "targetExampleSentences": [],
                "word": "homens"
            }]
        fields = ["word", "pos"]
        # Act
        restructured_dict = restructure_scraped_dict(scraped_word_data, fields)
        # Assert
        assert restructured_dict == {
            "homem sm": [
                {
                    "definition": "",
                    "nativeExampleSentences": [],
                    "pos": "sm",
                    "targetExampleSentences": [],
                    "translations": [
                        "man"
                    ],
                    "word": "homem"
                },
                {
                    "definition": "(ser humano)",
                    "nativeExampleSentences": [],
                    "pos": "sm",
                    "targetExampleSentences": [],
                    "translations": [
                        "man",
                        "person",
                        "human",
                        "human being"
                    ],
                    "word": "homem"
                }
            ],
            "homens sm pl": [
                {
                    "definition": "A humanidade.",
                    "pos": "sm pl",
                    "targetExampleSentences": [],
                    "word": "homens"
                }
            ],
        }

    def test_restructure_scraped_dict_word(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "",
                "nativeExampleSentences": [],
                "pos": "sm",
                "targetExampleSentences": [],
                "translations": [
                    "man"
                ],
                "word": "homem"
            },
            {
                "definition": "(ser humano)",
                "nativeExampleSentences": [],
                "pos": "sm",
                "targetExampleSentences": [],
                "translations": [
                    "man",
                    "person",
                    "human",
                    "human being"
                ],
                "word": "homem"
            },
            {
                "definition": "A humanidade.",
                "pos": "sm pl",
                "targetExampleSentences": [],
                "word": "homens"
            }]
        fields = ["word"]
        # Act
        restructured_dict = restructure_scraped_dict(scraped_word_data, fields)
        # Assert
        assert restructured_dict == {
            "homem": [
                {
                    "definition": "",
                    "nativeExampleSentences": [],
                    "pos": "sm",
                    "targetExampleSentences": [],
                    "translations": [
                        "man"
                    ],
                    "word": "homem"
                },
                {
                    "definition": "(ser humano)",
                    "nativeExampleSentences": [],
                    "pos": "sm",
                    "targetExampleSentences": [],
                    "translations": [
                        "man",
                        "person",
                        "human",
                        "human being"
                    ],
                    "word": "homem"
                }
            ],
            "homens": [
                {
                    "definition": "A humanidade.",
                    "pos": "sm pl",
                    "targetExampleSentences": [],
                    "word": "homens"
                }
            ],
        }

    def test_restructure_scraped_dict_pos(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "",
                "nativeExampleSentences": [],
                "pos": "sm",
                "targetExampleSentences": [],
                "translations": [
                    "man"
                ],
                "word": "homem"
            },
            {
                "definition": "(ser humano)",
                "nativeExampleSentences": [],
                "pos": "sm",
                "targetExampleSentences": [],
                "translations": [
                    "man",
                    "person",
                    "human",
                    "human being"
                ],
                "word": "homem"
            },
            {
                "definition": "A humanidade.",
                "pos": "sm pl",
                "targetExampleSentences": [],
                "word": "homens"
            }]
        fields = ["pos"]
        # Act
        restructured_dict = restructure_scraped_dict(scraped_word_data, fields)
        # Assert
        assert restructured_dict == {
            "sm": [
                {
                    "definition": "",
                    "nativeExampleSentences": [],
                    "pos": "sm",
                    "targetExampleSentences": [],
                    "translations": [
                        "man"
                    ],
                    "word": "homem"
                },
                {
                    "definition": "(ser humano)",
                    "nativeExampleSentences": [],
                    "pos": "sm",
                    "targetExampleSentences": [],
                    "translations": [
                        "man",
                        "person",
                        "human",
                        "human being"
                    ],
                    "word": "homem"
                }
            ],
            "sm pl": [
                {
                    "definition": "A humanidade.",
                    "pos": "sm pl",
                    "targetExampleSentences": [],
                    "word": "homens"
                }
            ],
        }

    def test_restructure_scraped_dict_no_word_no_pos(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "",
                "nativeExampleSentences": [],
                "pos": "sm",
                "targetExampleSentences": [],
                "translations": [
                    "man"
                ],
                "word": "homem"
            },
            {
                "definition": "(ser humano)",
                "nativeExampleSentences": [],
                "pos": "sm",
                "targetExampleSentences": [],
                "translations": [
                    "man",
                    "person",
                    "human",
                    "human being"
                ],
                "word": "homem"
            },
            {
                "definition": "A humanidade.",
                "pos": "sm pl",
                "targetExampleSentences": [],
                "word": "homens"
            }]
        fields = ["definition"]
        # Act
        restructured_dict = restructure_scraped_dict(scraped_word_data, fields)
        # Assert
        assert restructured_dict == {
            "": [
                {
                    "definition": "",
                    "nativeExampleSentences": [],
                    "pos": "sm",
                    "targetExampleSentences": [],
                    "translations": [
                        "man"
                    ],
                    "word": "homem"
                },
                {
                    "definition": "(ser humano)",
                    "nativeExampleSentences": [],
                    "pos": "sm",
                    "targetExampleSentences": [],
                    "translations": [
                        "man",
                        "person",
                        "human",
                        "human being"
                    ],
                    "word": "homem"
                },
                {
                    "definition": "A humanidade.",
                    "pos": "sm pl",
                    "targetExampleSentences": [],
                    "word": "homens"
                }
            ],
        }

    def test_restructure_scraped_dict_no_word_no_pos_in_word_data(self):
        # Arrange
        scraped_word_data = [{
            "targetExampleSentences": ["O Homem é uma invenção dele mesmo."]
        }]
        fields = ["word", "pos", "targetExampleSentences"]
        # Act
        restructured_dict = restructure_scraped_dict(scraped_word_data, fields)
        # Assert
        assert restructured_dict == {
            "": [{
                "targetExampleSentences": ["O Homem é uma invenção dele mesmo."]
            }]
        }

    def test_restructure_scraped_dict_no_scraped_word_data(self):
        # Arrange
        scraped_word_data = []
        fields = ["word", "pos"]
        # Act
        restructured_dict = restructure_scraped_dict(scraped_word_data, fields)
        # Assert
        assert restructured_dict == {}

    def test_format_entry(self):
        # Arrange
        entry = {
            "definition": "(ser humano)",
            "nativeExampleSentences": [],
            "pos": "sm",
            "targetExampleSentences": [],
            "translations": [
                "man",
                "person",
                "human",
                "human being"
            ],
            "word": "homem"
        }
        fields = ["translations", "definition"]
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == "(ser humano)<br>man, person, human, human being"

    def test_format_entry_no_fields(self):
        # Arrange
        entry = {
            "definition": "",
            "nativeExampleSentences": [],
            "pos": "sm",
            "targetExampleSentences": [],
            "translations": [
                "pineapple"
            ],
            "word": "abacaxi"
        }
        fields = []
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == ""

    def test_format_entry_multiple_fields(self):
        # Arrange
        entry = {
            "definition": "(de mucha edad)",
            "nativeExampleSentences": [
                "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
            ],
            "pos": "adj",
            "targetExampleSentences": [
                "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                "Hay un árbol muy viejo junto al lago."
            ],
            "translations": [
                "old"
            ],
            "word": "viejo"
        }
        fields = ["targetExampleSentences", "definition", "translations"]
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == "(de mucha edad)<br>old<br>En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo. Hay un árbol muy viejo junto al lago."

    def test_format_entry_empty_entry(self):
        # Arrange
        entry = {}
        fields = ["definition", "pos"]
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == ""

    def test_format_entry_audio_filenames(self):
        # Arrange
        entry = {
            "audioFilenames": [
                "pronunciation_es_es_viejo.ogg",
                "pronunciation_es_es_viejo2.ogg"
            ]
        }
        fields = ["definition", "audioFilenames"]
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == "[sound:pronunciation_es_es_viejo.ogg] [sound:pronunciation_es_es_viejo2.ogg]"

    def test_format_entry_translations(self):
        # Arrange
        entry = {
            "definition": "(del pasado)",
            "nativeExampleSentences": [
                "Child abuse is an old  problem that keeps on claiming victims throughout the world."
            ],
            "pos": "adj",
            "targetExampleSentences": [
                "El maltrato infantil es un viejo problema que sigue cobrando víctimas por todo el mundo."
            ],
            "translations": [
                "old, long-term, long-established",
                "traditional, time-honored"
            ],
            "word": "viejo"
        }
        fields = ["definition", "targetExampleSentences", "translations"]
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == "(del pasado)<br>old, long-term, long-established, traditional, time-honored<br>El maltrato infantil es un viejo problema que sigue cobrando víctimas por todo el mundo."

    def test_format_entry_target_example_sentences(self):
        # Arrange
        entry = {
            "definition": "(de mucha edad)",
            "nativeExampleSentences": [
                "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
            ],
            "pos": "adj",
            "targetExampleSentences": [
                "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                "Hay un árbol muy viejo junto al lago."
            ],
            "translations": [
                "old"
            ],
            "word": "viejo"
        }
        fields = ["targetExampleSentences"]
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo. Hay un árbol muy viejo junto al lago."

    def test_format_entry_expression_and_expression_meaning(self):
        # Arrange
        entry = {
            "expression": "Homem de poucas palavras",
            "expressionMeaning": ": indivíduo reservado, que fala pouco."
        }
        fields = ["targetExampleSentences", "expression", "expressionMeaning"]
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == "Homem de poucas palavras<br>: indivíduo reservado, que fala pouco."

    def test_create_csv_side_no_fields(self):
        # Arrange
        entry = {
            "definition": "(de mucha edad)",
            "nativeExampleSentences": [
                "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
            ],
            "pos": "adj",
            "targetExampleSentences": [
                "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                "Hay un árbol muy viejo junto al lago."
            ],
            "translations": [
                "old"
            ],
            "word": "viejo"
        }
        fields = []
        # Act
        formatted_entry = format_entry(entry, fields)
        # Assert
        assert formatted_entry == ""

    def test_create_csv_side_no_scraped_word_data(self):
        # Arrange
        scraped_word_data = []
        side_format = {
            "fields": [
                "word",
                "pos",
                "definition",
            ]
        }
        # Act
        csv_side = create_csv_side(scraped_word_data, side_format)
        # Assert
        assert csv_side == ""

    def test_create_csv_side_pos_word(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "(de mucha edad)",
                "nativeExampleSentences": [
                    "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                    "Hay un árbol muy viejo junto al lago."
                ],
                "translations": [
                    "old"
                ],
                "word": "viejo"
            },
            {
                "definition": "(objeto: desgastado)",
                "nativeExampleSentences": [
                    "I want to change my old (or:  worn-out) car for a new one."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "Voy a cambiar mi coche viejo por uno nuevo."
                ],
                "translations": [
                    "old, worn out"
                ],
                "word": "viejo"
            },
            {
                "definition": "(del pasado)",
                "nativeExampleSentences": [
                    "Child abuse is an old  problem that keeps on claiming victims throughout the world."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "El maltrato infantil es un viejo problema que sigue cobrando víctimas por todo el mundo."
                ],
                "translations": [
                    "old, long-term, long-established",
                    "traditional, time-honored"
                ],
                "word": "viejo"
            }
        ]
        side_format = {
            "fields": [
                "word",
                "pos",
                "definition"
            ]
        }
        # Act
        csv_side = create_csv_side(scraped_word_data, side_format)
        # Assert
        assert csv_side == "viejo adj<br>(de mucha edad)<br>(objeto: desgastado)<br>(del pasado)"

    def test_create_csv_side_word(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "(de mucha edad)",
                "nativeExampleSentences": [
                    "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                    "Hay un árbol muy viejo junto al lago."
                ],
                "translations": [
                    "old"
                ],
                "word": "viejo"
            },
            {
                "definition": "(objeto: desgastado)",
                "nativeExampleSentences": [
                    "I want to change my old (or:  worn-out) car for a new one."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "Voy a cambiar mi coche viejo por uno nuevo."
                ],
                "translations": [
                    "old, worn out"
                ],
                "word": "viejo"
            },
            {
                "definition": "(del pasado)",
                "nativeExampleSentences": [
                    "Child abuse is an old  problem that keeps on claiming victims throughout the world."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "El maltrato infantil es un viejo problema que sigue cobrando víctimas por todo el mundo."
                ],
                "translations": [
                    "old, long-term, long-established",
                    "traditional, time-honored"
                ],
                "word": "viejo"
            }
        ]
        side_format = {
            "fields": [
                "word",
                "definition"
            ]
        }
        # Act
        csv_side = create_csv_side(scraped_word_data, side_format)
        # Assert
        assert csv_side == "viejo<br>(de mucha edad)<br>(objeto: desgastado)<br>(del pasado)"

    def test_create_csv_side_pos(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "(de mucha edad)",
                "nativeExampleSentences": [
                    "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                    "Hay un árbol muy viejo junto al lago."
                ],
                "translations": [
                    "old"
                ],
                "word": "viejo"
            },
            {
                "definition": "(objeto: desgastado)",
                "nativeExampleSentences": [
                    "I want to change my old (or:  worn-out) car for a new one."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "Voy a cambiar mi coche viejo por uno nuevo."
                ],
                "translations": [
                    "old, worn out"
                ],
                "word": "viejo"
            },
            {
                "definition": "(del pasado)",
                "nativeExampleSentences": [
                    "Child abuse is an old  problem that keeps on claiming victims throughout the world."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "El maltrato infantil es un viejo problema que sigue cobrando víctimas por todo el mundo."
                ],
                "translations": [
                    "old, long-term, long-established",
                    "traditional, time-honored"
                ],
                "word": "viejo"
            }
        ]
        side_format = {
            "fields": [
                "pos",
                "definition"
            ]
        }
        # Act
        csv_side = create_csv_side(scraped_word_data, side_format)
        # Assert
        assert csv_side == "adj<br>(de mucha edad)<br>(objeto: desgastado)<br>(del pasado)"

    def test_create_csv_side_no_word_no_pos(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "(de mucha edad)",
                "nativeExampleSentences": [
                    "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                    "Hay un árbol muy viejo junto al lago."
                ],
                "translations": [
                    "old"
                ],
                "word": "viejo"
            },
            {
                "definition": "(objeto: desgastado)",
                "nativeExampleSentences": [
                    "I want to change my old (or:  worn-out) car for a new one."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "Voy a cambiar mi coche viejo por uno nuevo."
                ],
                "translations": [
                    "old, worn out"
                ],
                "word": "viejo"
            },
            {
                "definition": "(del pasado)",
                "nativeExampleSentences": [
                    "Child abuse is an old  problem that keeps on claiming victims throughout the world."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "El maltrato infantil es un viejo problema que sigue cobrando víctimas por todo el mundo."
                ],
                "translations": [
                    "old, long-term, long-established",
                    "traditional, time-honored"
                ],
                "word": "viejo"
            }
        ]
        side_format = {
            "fields": [
                "definition"
            ]
        }
        # Act
        csv_side = create_csv_side(scraped_word_data, side_format)
        # Assert
        assert csv_side == "(de mucha edad)<br>(objeto: desgastado)<br>(del pasado)"

    def test_create_csv_side_one_entry(self):
        # Arrange
        scraped_word_data = [
            {
                "definition": "(de mucha edad)",
                "nativeExampleSentences": [
                    "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                ],
                "pos": "adj",
                "targetExampleSentences": [
                    "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                    "Hay un árbol muy viejo junto al lago."
                ],
                "translations": [
                    "old"
                ],
                "word": "viejo"
            }
        ]
        side_format = {
            "fields": [
                "word",
                "pos",
                "translations",
                "definition",
                "targetExampleSentences"
            ]
        }
        # Act
        csv_side = create_csv_side(scraped_word_data, side_format)
        # Assert
        assert csv_side == "viejo adj<br>(de mucha edad)<br>old<br>En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo. Hay un árbol muy viejo junto al lago."

    def test_create_csv_sides_all_fields_same_side(self):
        # Arrange
        word_data = {
            "inputWord": "viejo",
            "scrapedWordData": [
                {
                    "definition": "(de mucha edad)",
                    "nativeExampleSentences": [
                        "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                    ],
                    "pos": "adj",
                    "targetExampleSentences": [
                        "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                        "Hay un árbol muy viejo junto al lago."
                    ],
                    "translations": [
                        "old"
                    ],
                    "word": "viejo"
                },
                {
                    "definition": "(objeto: desgastado)",
                    "nativeExampleSentences": [
                        "I want to change my old (or:  worn-out) car for a new one."
                    ],
                    "pos": "adj",
                    "targetExampleSentences": [
                        "Voy a cambiar mi coche viejo por uno nuevo."
                    ],
                    "translations": [
                        "old, worn out"
                    ],
                    "word": "viejo"
                },
            ],
            "urls": ["https://www.spanishdict.com/translate/viejo?langFrom=es"]
        }
        card_format = {
            "sides": [
                {
                    "fields": [
                        "inputWord"
                    ]
                },
                {
                    "fields": [
                        "word",
                        "pos",
                        "definition",
                        "translations",
                        "targetExampleSentences",
                        "nativeExampleSentences"
                    ]
                }
            ]
        }
        # Act
        csv_sides = create_csv_sides(word_data, card_format)
        # Assert
        assert csv_sides == [
            "viejo",
            "viejo adj<br>(de mucha edad)<br>old<br>En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo. Hay un árbol muy viejo junto al lago.<br>ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day.<br>(objeto: desgastado)<br>old, worn out<br>Voy a cambiar mi coche viejo por uno nuevo.<br>I want to change my old (or:  worn-out) car for a new one.<br><br><a href='https://www.spanishdict.com/translate/viejo?langFrom=es'>https://www.spanishdict.com/translate/viejo?langFrom=es</a>"
        ]

    def test_create_csv_sides_multiple_sides(self):
        # Arrange
        word_data = {
            "inputWord": "viejo",
            "scrapedWordData": [
                {
                    "definition": "(de mucha edad)",
                    "nativeExampleSentences": [
                        "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                    ],
                    "pos": "adj",
                    "targetExampleSentences": [
                        "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                        "Hay un árbol muy viejo junto al lago."
                    ],
                    "translations": [
                        "old"
                    ],
                    "word": "viejo"
                },
                {
                    "definition": "(objeto: desgastado)",
                    "nativeExampleSentences": [
                        "I want to change my old (or:  worn-out) car for a new one."
                    ],
                    "pos": "adj",
                    "targetExampleSentences": [
                        "Voy a cambiar mi coche viejo por uno nuevo."
                    ],
                    "translations": [
                        "old, worn out"
                    ],
                    "word": "viejo"
                },
            ],
            "urls": ["https://www.spanishdict.com/translate/viejo?langFrom=es"]
        }
        card_format = {
            "sides": [
                {
                    "fields": [
                        "inputWord"
                    ]
                },
                {
                    "fields": [
                        "word",
                        "pos",
                        "definition",
                        "translations",
                    ]
                },
                {
                    "fields": [
                        "targetExampleSentences"
                    ]
                }
            ]
        }
        # Act
        csv_sides = create_csv_sides(word_data, card_format)
        # Assert
        assert csv_sides == [
            "viejo",
            "viejo adj<br>(de mucha edad)<br>old<br>(objeto: desgastado)<br>old, worn out<br><br><a href='https://www.spanishdict.com/translate/viejo?langFrom=es'>https://www.spanishdict.com/translate/viejo?langFrom=es</a>",
            "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo. Hay un árbol muy viejo junto al lago.<br>Voy a cambiar mi coche viejo por uno nuevo."
        ]

    def test_create_csv_sides_no_sides(self):
        # Arrange
        word_data = {
            "inputWord": "viejo",
            "scrapedWordData": [
                {
                    "definition": "(de mucha edad)",
                    "nativeExampleSentences": [
                        "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                    ],
                    "pos": "adj",
                    "targetExampleSentences": [
                        "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                        "Hay un árbol muy viejo junto al lago."
                    ],
                    "translations": [
                        "old"
                    ],
                    "word": "viejo"
                }
            ]
        }
        card_format = {
            "sides": []
        }
        # Act
        csv_sides = create_csv_sides(word_data, card_format)
        # Assert
        assert csv_sides == ["viejo"]

    def test_create_csv_side_no_input_word(self):
        # Arrange
        word_data = {
            "scrapedWordData": [
                {
                    "definition": "(de mucha edad)",
                    "nativeExampleSentences": [
                        "ⓘEsta oración no es una traducción de la original.  Despite being old, John played tennis for an hour every day."
                    ],
                    "pos": "adj",
                    "targetExampleSentences": [
                        "En 2007, Tomoji Tanabe fue designado por Guinness como el hombre más viejo del mundo.",
                        "Hay un árbol muy viejo junto al lago."
                    ],
                    "translations": [
                        "old"
                    ],
                    "word": "viejo"
                }
            ]
        }
        card_format = {
            "sides": [
                {
                    "fields": [
                        "inputWord"
                    ]
                },
                {
                    "fields": [
                        "word",
                        "pos",
                        "definition",
                        "translations",
                    ]
                }
            ]
        }
        # Act
        csv_sides = create_csv_sides(word_data, card_format)
        # Assert
        assert csv_sides == ["", "viejo adj<br>(de mucha edad)<br>old"]

    def test_create_csv_sides_no_scraped_data(self):
        # Arrange
        word_data = {
            "inputWord": "viejo",
        }
        card_format = {
            "sides": [
                {
                    "fields": [
                        "inputWord"
                    ]
                },
                {
                    "fields": [
                        "word",
                        "pos",
                        "definition",
                        "translations",
                    ]
                }
            ]
        }
        # Act
        csv_sides = create_csv_sides(word_data, card_format)
        # Assert
        assert csv_sides == ["viejo", ""]

    def test_create_csv_sides_empty_scraped_data(self):
        word_data = {
            "inputWord": "viejo",
            "scrapedWordData": []
        }
        card_format = {
            "sides": [
                {
                    "fields": [
                        "inputWord"
                    ]
                },
                {
                    "fields": [
                        "word",
                        "pos",
                        "definition",
                        "translations",
                    ]
                }
            ]
        }
        # Act
        csv_sides = create_csv_sides(word_data, card_format)
        # Assert
        assert csv_sides == ["viejo", ""]
