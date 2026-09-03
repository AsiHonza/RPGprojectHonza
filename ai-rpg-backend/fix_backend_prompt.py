import codecs
import re

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '"image_prompt": "Prompt pro AI gener' in l:
        lines[i] = l.replace(
            '"image_prompt": "Prompt pro AI generátor obrázků (anglicky) zobrazující aktuální scénu (Temné fantasy, atmosférické).",',
            '"image_prompt": "Prompt pro AI generátor obrázků (anglicky) zobrazující aktuální scénu. STYL: Vibrant, bright, lush, magical, Fable style fantasy, warm sunlight, colorful, fairy tale.",'
        )

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
