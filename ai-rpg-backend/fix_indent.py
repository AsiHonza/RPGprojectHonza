import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "world_data = state_dict.get('world_data')" in line:
        lines[i] = "        world_data = state_dict.get('world_data')\n"
    elif "world_prompt_str = \"\"" in line:
        lines[i] = "        world_prompt_str = \"\"\n"
    elif "if world_data:" in line:
        lines[i] = "        if world_data:\n"
    elif "world_prompt_str = f\"\\n[TOTO JE ŘÍZENÝ SANDBOX" in line:
        lines[i] = "            " + line.lstrip()
    elif "# Automatický výpočet" in line:
        lines[i] = "            " + line.lstrip()
    elif "# (Tohle vyřešíme" in line:
        lines[i] = "            " + line.lstrip()

with codecs.open("main.py", "w", "utf-8") as f:
    f.writelines(lines)

print("Indentation fixed.")
