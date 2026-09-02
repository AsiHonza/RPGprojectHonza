import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

bad_prompt = "POUŽIJ POLE 'travel_days_left_set' a nastav tam (aktuální hodnota mínus jedna). Pokud klesne na 0, nastav 'travel_mode_set' na false a 'travel_destination_set' na prázdný řetězec. a odečti 1 z 'rations'. Pokud travel_days_left klesne na 0, hráč dorazil do cíle a 'travel_mode' nastav na false."
good_prompt = "POUŽIJ POLE 'travel_days_left_set' a nastav tam (aktuální hodnota mínus jedna). Pokud klesne na 0, nastav 'travel_mode_set' na false a 'travel_destination_set' na prázdný řetězec. ODEČTI 1 z 'rations'."

content = content.replace(bad_prompt, good_prompt)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Prompt fixed.")
