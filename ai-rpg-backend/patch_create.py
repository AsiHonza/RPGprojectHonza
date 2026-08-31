import codecs

with codecs.open('main.py', 'r', 'utf-8') as f:
    content = f.read()

old_str = '''updated_history = [{"role": "model", "text": response.text}]
        supabase.table("characters").update({"history": updated_history}).eq("api_key", req.api_key).execute()'''
new_str = '''updated_history = [{"role": "model", "text": response.text}]
        supabase.table("characters").update({"history": updated_history}).eq("api_key", db_key).execute()'''

content = content.replace(old_str, new_str)

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.write(content)
print("Patch applied.")
