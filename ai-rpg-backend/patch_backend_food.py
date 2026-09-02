import codecs

lines = codecs.open('main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'if target_hex["terrain"] in ["Ocean", "Mountains"]:' in l:
        new_block = """    if target_hex["terrain"] in ["Ocean"]:
        raise HTTPException(status_code=400, detail="Oceán je neprostupný.")
        
    if target_hex["terrain"] in ["Swamp", "Wasteland", "Desert", "Mountains"] and state.get("rations", 0) < 2:
        raise HTTPException(status_code=400, detail="Nemůžeš vstoupit do tohoto terénu s méně než 2 zásobami jídla.")
"""
        lines[i] = new_block
        lines[i+1] = "" # remove the raise line
        break

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
