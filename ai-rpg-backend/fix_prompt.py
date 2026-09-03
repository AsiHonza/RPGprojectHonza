import re

with open('app/routers/game.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the dump of entire char_data.get('state', {}) with a stripped version
old_line = "json.dumps(char_data.get('state', {}), ensure_ascii=False)"

new_code = '''json.dumps({
    k: v for k, v in char_data.get('state', {}).items() 
    if k not in ['worldData', 'history', 'quests', 'npcs', 'journal']
}, ensure_ascii=False)'''

text = text.replace(old_line, new_code)

with open('app/routers/game.py', 'w', encoding='utf-8') as f:
    f.write(text)
