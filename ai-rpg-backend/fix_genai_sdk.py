import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

bad_genai_code = """        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:
Jméno: {req.name}
Rasa: {req.race}
Třída: {req.dnd_class}
Staty: {req.stats}

Napiš poutavý první odstavec (intro), který postavu rovnou vrhne do děje. Zohledni její rasu a třídu. Nezačínej v obyčejné hospodě, začni např. na deštivé cestě, uprostřed lesa, u brány města nebo v nebezpečí.
Vrať POUZE json ve formátu:
{{
  "intro_text": "Text vypravěče (min 3 věty)...",
  "popis_okoli": "Stručný popis lokace (např. Temný les plný stínů a vlhka)"
}}
        '''
        response = model.generate_content(prompt)"""

fixed_genai_code = """        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        prompt = f'''
Jsi Pán jeskyně v textové RPG hře D&D. Hráč právě vytvořil novou postavu:
Jméno: {req.name}
Rasa: {req.race}
Třída: {req.dnd_class}
Staty: {req.stats}

Napiš poutavý první odstavec (intro), který postavu rovnou vrhne do děje. Zohledni její rasu a třídu. Nezačínej v obyčejné hospodě, začni např. na deštivé cestě, uprostřed lesa, u brány města nebo v nebezpečí.
Vrať POUZE json ve formátu:
{{
  "intro_text": "Text vypravěče (min 3 věty)...",
  "popis_okoli": "Stručný popis lokace (např. Temný les plný stínů a vlhka)"
}}
        '''
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )"""

content = content.replace(bad_genai_code, fixed_genai_code)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("GenAI SDK syntax fixed!")
