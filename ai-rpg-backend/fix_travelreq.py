import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'class TravelRequest(BaseModel):' in l:
        # Find where to inject api_key
        pass
    if 'target_r: int' in l and 'class TravelRequest' in "".join(lines[i-4:i]):
        lines[i] = '    target_r: int\n    api_key: str = "DUMMY"\n'

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
