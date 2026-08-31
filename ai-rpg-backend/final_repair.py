import codecs

with codecs.open('main.py', 'r', 'utf-8') as f:
    content = f.read()

start_idx = content.find("ZÁZNAMY PRO FRONTEND:")

if start_idx != -1:
    end_idx = content.find("            {\"role\": \"model\", \"text\": response.text}", start_idx)
    
    missing_code = '''ZÁZNAMY PRO FRONTEND:
- Do 'popis_okoli' popiš situaci. Můžeš přidat 'image_prompt' (přidej "black and white ink drawing, simple line art").
- Do 'vypravec' piš POUZE beletristické vyprávění světa – jak se situace odvíjí, jak reagují NPC, atmosféru. NIKDY sem nepsat technické detaily (čísla hodů, XP, poškození).
- Do 'system_log' zapiš VŠECHNY technické herní mechaniky odděleně: výsledky hodů kostkou (např. "Hod na Útok: d20=14 + STR 2 = 16 vs. Obrana 12 -> Zásah!"), způsobené/přijaté poškození, získané XP, level-up oznámení. Tento text se hráči NEBUDE číst nahlas.
- Pro NPC použij VÝHRADNĚ 'npc_dialogy' (pohlavi="muz"/"zena", image_prompt="black and white ink drawing portrait"). PŘÍSNÝ ZÁKAZ: Pokud jakákoliv postava promluví (přímá řeč), NESMÍ to být v textu 'vypravec'. Vypravěč slouží POUZE pro popis děje (např. "Garrick se na tebe podíval."). Samotná věta, kterou Garrick řekne, už MUSÍ být odděleně vložena do 'npc_dialogy'. Pokud mluví více postav, vlož do 'npc_dialogy' více objektů.
"""

        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=DMResponse,
                temperature=0.7,
            )
        )
        
        dm_json = json.loads(response.text)
        
        # Uložení nových důležitých faktů do dlouhodobé paměti
        fakta = dm_json.get("dulezita_fakta", [])
        for fakt in fakta:
            await store_memory(db_key, fakt, client)
        
        # 3. Uložení upraveného stavu do DB
        updated_history = history + [
            {"role": "user", "text": req.action_text},
            {"role": "model", "text": response.text}
'''
    
    content = content[:start_idx] + missing_code + content[end_idx + len("            {\"role\": \"model\", \"text\": response.text}"):]
    
    with codecs.open('main.py', 'w', 'utf-8') as f:
        f.write(content)
    print("Repaired.")
else:
    print("Not found.")
