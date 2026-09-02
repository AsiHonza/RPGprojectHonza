import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# Replace
if "novy_zapis_do_deniku" not in content:
    content = content.replace(
        '    image_prompt: str\n    vypravec: str',
        '    image_prompt: str\n    novy_zapis_do_deniku: Optional[str] = Field(default=None, description="Zásadní posun v ději. Napiš max 2 věty, které se zapíšou do hráčova deníku jako shrnutí (např. Zabil jsem vlka a zachránil vesnici). U běžných kroků nech prázdné.")\n    vypravec: str'
    )

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("DMResponse updated!")
