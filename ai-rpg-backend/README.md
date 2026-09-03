# AI RPG Backend (FastAPI)

Tento repozitáø obsahuje backend pro hru Aelthgard (AI Dungeons & Dragons RPG). Zajišuje logiku hry, orchestraci umìlé inteligence (Google Gemini 2.5 Flash), generování mapy a uloení stavu hráèe do databáze Supabase.

## Architektura (Verze 2.1)

Backend vyuívá moderní modulární strukturu nad frameworkem **FastAPI** a **Pydantic**. Cílem této architektury je snadná udritelnost, testovatelnost a naprostá odolnost proti halucinacím AI modelù díky striktnì typovanım vıstupùm.

### Struktura sloek:
- pp/
  - core/: Konfigurace prostøedí (naèítání .env) a instanciace klientù (Supabase, Google GenAI).
  - models/: **Pydantic schémata** (schemas.py). Zde jsou definovány veškeré vstupní poadavky (Requests) z frontendu a pøedevším DMResponse (Dungeon Master Response), které si backend vynucuje po AI modelu pomocí funkce esponse_schema. Tím je zaruèeno, e JSON vrácenı modelem bude vdy validní.
  - outers/: Rozdìlené API endpointy (uth.py, character.py, game.py, udio.py) udrují hlavní main.py naprosto èistı a starají se o specifické úseky logiky.
  - services/: Herní mikrosluby. 
    - game_service.py drí mechaniky D&D, šablony ras a povolání, a poèítání vzdálenosti na hexovıch møíkách.
    - llm_service.py spravuje pamìové funkce (ukládání dùleitıch faktù a naèítání z historie postavy).

## Technologie
- **Python 3.11+**
- **FastAPI** (pro asynchronní webovı server)
- **Uvicorn** (ASGI server)
- **Pydantic** (validace dat a definice strukturovanıch vıstupù)
- **Supabase** (PostgreSQL databáze)
- **Google GenAI SDK** (Gemini 2.5 Flash pro øízení Pøehrávaèe jeskynì)
- **Edge-TTS** (Generování èeského hlasu Vypravìèe)

## Spuštìní vıvoje
Pro vıvoj vyuíváme balíèkovací nástroj uv. 

\\\ash
# Instalace závislostí
uv pip install -r requirements.txt

# Spuštìní serveru
uv run uvicorn main:app --reload
\\\

## Databáze (Supabase)
Backend komunikuje s tabulkou characters, kde je uchovávána historie kadého hráèe. Z dùvodu rychlosti vıvoje je v souèasné chvíli stav hráèe (lokace, inventáø, odehraná historie) serializován v jednom dynamickém JSON objektu state. 
V dalších verzích se plánuje postupná normalizace databáze na více samostatnıch tabulek pro Lokace, Pøedmìty a NPC.
