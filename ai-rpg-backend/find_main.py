import json

with open(r"C:\Users\janml\.gemini\antigravity\brain\e6172b18-629c-49dc-a039-a7cdbb7d7284\.system_generated\logs\transcript_full.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        data = json.loads(line)
        content = data.get("content", "")
        if "class DMResponse(BaseModel):" in content and "def create_character" in content:
            print(f"Found! Length: {len(content)}")
            with open("main_recovered.py", "w", encoding="utf-8") as out:
                out.write(content)
