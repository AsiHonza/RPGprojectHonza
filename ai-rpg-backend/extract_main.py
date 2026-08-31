import json
import re

with open(r"C:\Users\janml\.gemini\antigravity\brain\e6172b18-629c-49dc-a039-a7cdbb7d7284\.system_generated\logs\transcript_full.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get("type") == "GENERIC" and "def create_character" in data.get("content", ""):
                print("FOUND POTENTIAL MATCH")
                # Look for the source code block
                content = data["content"]
                if "class DMResponse(BaseModel):" in content:
                    print("FOUND CLASS DMRESPONSE")
                    with open("main_extracted.py", "w", encoding="utf-8") as out:
                        out.write(content)
                    break
        except Exception as e:
            pass
