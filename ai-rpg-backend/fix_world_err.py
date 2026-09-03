import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'world_data = None' in l and 'World gen failed:' in lines[i+1]:
        lines[i] = '            raise HTTPException(status_code=500, detail=f"Chyba při generování světa: {str(e)}")\n'
        lines[i+1] = ''

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
