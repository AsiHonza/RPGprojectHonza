from app.core.config import supabase
from google.genai import types

def format_prompt_memory(state_dict: dict) -> str:
    """Format L2 Episodic Chronicle and L3 Factual Knowledge into a compact prompt injection."""
    sections = []
    
    kronika = state_dict.get('kronika', [])
    if kronika:
        sections.append("[KRONIKA PŘÍBĚHU (Dosavadní milníky)]:\n" + "\n".join([f"• {k}" for k in kronika[-5:]]))
    
    fakta = state_dict.get('svetova_fakta', [])
    if fakta:
        sections.append("[TRVALÁ FAKTA A ZNALOSTI SVĚTA (NPC si toto pamatují)]:\n" + "\n".join([f"• {f}" for f in fakta[-12:]]))
        
    reputace = state_dict.get('reputace') or {}
    active_rep = []
    for k, v in reputace.items():
        try:
            val = int(v)
            if val != 0:
                active_rep.append(f"{k}: {val:+d}")
        except Exception:
            if v:
                active_rep.append(f"{k}: {v}")
    if active_rep:
        sections.append("[REPUTACE U FRAKCÍ A BOHŮ]:\n" + ", ".join(active_rep))
        
    return "\n\n".join(sections)

def store_factual_memory(state_dict: dict, fakta_list: list):
    """Store new unique facts into L3 factual memory."""
    if not fakta_list:
        return
    current_facts = state_dict.setdefault('svetova_fakta', [])
    for f in fakta_list:
        if not f or not isinstance(f, str):
            continue
        clean_f = f.strip()
        if clean_f and clean_f not in current_facts:
            current_facts.append(clean_f)
    # Keep the most relevant/recent 25 facts
    if len(current_facts) > 25:
        state_dict['svetova_fakta'] = current_facts[-25:]

async def compress_history_to_chronicle(history_slice: list, client) -> str:
    """Asynchronously compress a batch of turns into a 1-2 sentence chronicle entry."""
    if not history_slice or not client:
        return ""
    
    events_text = ""
    for msg in history_slice:
        role = "Hráč" if msg.get('role') == 'user' else "Vypravěč"
        text = msg.get('text') or msg.get('content') or ""
        events_text += f"{role}: {text[:180]}\n"
        
    prompt = f"""Jsi kronikář fantasy světa Aelthgard. 
Shrň následující herní události do 1 až maximálně 2 výstižných, atmosférických vět v češtině pro deník dobrodruha.
Zmiň konkrétní místa, NPC nebo důležitá rozhodnutí:

{events_text}

Vrať pouze čisté shrnutí bez uvozovek a úvodních řečí."""

    try:
        resp = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.3, max_output_tokens=150)
        )
        return resp.text.strip() if resp and resp.text else ""
    except Exception as e:
        print("Chronicle compression error:", e)
        return ""

async def retrieve_memories(api_key, action_text, client):
    """Backward compatibility stub."""
    return ""

async def store_memory(api_key, fakt, client):
    """Backward compatibility stub."""
    pass
