import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'intro_text = "Vítej ve světě' in l or 'intro_text = "Vtej ve svt' in l:
        lines[i] = '        raise HTTPException(status_code=500, detail=f"Chyba při generování intro textu: {str(e)}")\n'
    if 'popis_okoli = "Zamlžený' in l or 'popis_okoli = "Zamlžen' in l or 'popis_okoli = "Zaml' in l:
        lines[i] = ''

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
