import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# 1. Update the Pydantic model for state schema to accept new fields
if "travel_mode: bool = Field(default=False)" not in content:
    content = content.replace(
        'locationType: str\n    currentRegion: str',
        'locationType: str\n    currentRegion: str\n    travel_mode: bool = Field(default=False)\n    travel_days_left: int = Field(default=0)\n    travel_destination: str = Field(default="")\n    past_encounters: list[str] = Field(default=[])'
    )

# 2. Add random roll logic in /action before making the prompt
import_random = "import random"
if import_random not in content:
    content = "import random\n" + content

# Find where the prompt is constructed
prompt_start = 'context_action = f"""[Dlouhodob pam (relevantn fakta z minulosti):]'
# We need to insert the travel logic before context_action
travel_logic = """
        state_dict = char_data.get('state', {})
        travel_days_left = state_dict.get("travel_days_left", 0)
        is_traveling = state_dict.get("travel_mode", False) or travel_days_left > 0
        
        travel_prompt = ""
        if is_traveling:
            roll = random.randint(1, 20)
            if roll <= 5:
                enc = "Klidná cesta. ŽÁDNÝ BOJ ANI HROZBA. Popiš pouze krásu či ponurost krajiny, počasí a nechej hráče urazit kus cesty."
            elif roll <= 9:
                enc = "Objev zajímavé lokace. Hráč narazí na opuštěné či tajuplné místo (ruiny, stará svatyně, podivný strom). Žádný přímý útok, nech ho zkoumat."
            elif roll <= 13:
                enc = "Fyzická překážka. Do cesty se postavila nebezpečná překážka (stržený most, bouře, bažina). Hráč musí vymyslet, jak ji překonat."
            elif roll <= 16:
                enc = "Sociální setkání. Hráč potká cestovatele (kupec, prchající člověk, poutník). Žádná monstra."
            elif roll <= 19:
                enc = "Bojové přepadení! Hráč je napaden monstrem nebo bandity unikátními pro tento region. Vytvoř boj."
            else:
                enc = "Epická vzácná událost. Obrovská hrozba nebo magická anomálie. Scéna musí brát dech."
            
            travel_prompt = f"\\n[SYSTÉMOVÝ HOD NA SETKÁNÍ PRO TENTO TAH: {roll}]\\nPŘÍSNÝ PŘÍKAZ: Tvoje vyprávění V TOMTO TAHU se musí točit výhradně kolem tohoto scénáře: {enc}\\nODEČTI 1 z 'travel_days_left' a odečti 1 z 'rations'. Pokud travel_days_left klesne na 0, hráč dorazil do cíle a 'travel_mode' nastav na false.\\n\\nPokud text akce začíná na [OOC/MYŠLENKA], ignoruj hod a nic neodečítej!"
        else:
            travel_prompt = "\\n[SYSTÉM: CESTOVÁNÍ]: Pokud hráč vyslovil přání odejít daleko do jiné lokace, ZAHÁJÍŠ CESTOVÁNÍ. Nastav state.travel_mode = true, state.travel_destination = 'Cíl' a state.travel_days_left = (číslo 2 až 5 podle dálky). V tomto tahu pouze popiš, že vyráží. (Pokud používá OOC, ignoruj to)."
"""

if "is_traveling = state_dict.get" not in content:
    # insert before context_action
    content = re.sub(
        r'(\s*relevant_memories = ""\s*# Pidn aktuln akce s kontextem\s*context_action = f\"\"\")',
        travel_logic.replace("\\", "\\\\") + r'\1',
        content,
        count=1
    )

# 3. Inject travel_prompt into context_action
if "{travel_prompt}" not in content:
    content = content.replace(
        '[Akce hre:]',
        '{travel_prompt}\n\n[Akce hre:]'
    )

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)

print("Travel mode added to backend.")
