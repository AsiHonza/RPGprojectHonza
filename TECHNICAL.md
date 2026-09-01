# Technická Dokumentace

Tento projekt se skládá ze dvou oddělených částí (Monorepo struktura):
1. **Frontend (`/ai-rpg-frontend`)** - Klientská webová aplikace v React / Next.js
2. **Backend (`/ai-rpg-backend`)** - Serverová API část v Python / FastAPI

## 🛠 Technologický Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS, Lucide-React (ikony).
- **Backend:** Python, FastAPI, Uvicorn, Google GenAI SDK (Gemini).
- **Databáze:** Supabase (PostgreSQL) spravovaná skrze REST API.
- **AI Model:** Google Gemini (zpracování logiky DM, systém prompty, strukturované JSON výstupy).
- **TTS (Text-To-Speech):** Neoficiální edge-tts knihovna pro český hlasový výstup.
- **Generování Obrázků:** Pollinations.ai (free API).

## 🚀 Architektura a Data Flow

1. **Uživatel (Frontend)** odešle akci přes textové pole.
2. Frontend zašle `POST` požadavek na Backend (`/action`), obsahující e-mail hráče, dosavadní statistiky a text akce.
3. **Backend** přijme požadavek:
   - Zkontroluje v Supabase databázi historii hry pro danou postavu.
   - Sestaví masivní systémový prompt obsahující pravidla hry, aktuální inventář, HP, historii posledních zpráv a hráčovu akci.
   - Odešle dotaz na **Gemini API**.
   - Očekává striktní JSON odpověď od Gemini (obsahující text vypravěče, úpravu HP, nově nalezené itemy atd.).
   - Uloží nový stav do Supabase a navrátí JSON zpět na Frontend.
4. **Frontend** obdrží odpověď:
   - Aktualizuje stav uživatelského rozhraní (HP, přidá item do batohu).
   - Pomocí endpointu `/tts` zažádá o vygenerování audia k textu vypravěče a začne jej automaticky přehrávat.
   - Vykreslí zprávu do historie.

## ⚙️ Spuštění a Vývoj (Lokálně)

### 1. Spuštění Backend serveru
```bash
cd ai-rpg-backend
# Vytvoření a aktivace virtuálního prostředí (doporučeno)
python -m venv venv
.\venv\Scripts\activate
# Instalace závislostí
pip install fastapi uvicorn google-genai supabase edge-tts
# Nastavení .env souboru: GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY
# Spuštění serveru
uvicorn main:app --reload
```
Server poběží na `http://localhost:8000`.

### 2. Spuštění Frontend aplikace
```bash
cd ai-rpg-frontend
# Instalace závislostí
npm install
# Nastavení .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
# Spuštění vývojového serveru
npm run dev
```
Aplikace poběží na `http://localhost:3000`.

## 🌐 Nasazení (Produkce)

Aplikace je aktuálně nasazena v cloudu:

1. **Backend (Render.com)**
   - Typ: Web Service (Docker)
   - Environment Variables:
     - `GEMINI_API_KEY`: API klíč pro Google AI Studio (centrální klíč pro všechny hráče).
     - `SUPABASE_URL` a `SUPABASE_KEY`: Připojovací údaje k databázi.
     - `WEB_CONCURRENCY=1`: Nastaveno automaticky Renderem.

2. **Frontend (Vercel)**
   - Root Directory: `ai-rpg-frontend`
   - Build nastavení: V `next.config.ts` je nastaveno ignorování chyb ESLint a TypeScriptu, aby Vercel nasadil aplikaci i při výstrahách.
   - Environment Variables:
     - `NEXT_PUBLIC_API_URL`: URL adresa živého backendu z Renderu (např. `https://aelthgard-rpg.onrender.com`).

## 🔐 Zabezpečení a API Klíče

Původně hra vyžadovala, aby každý uživatel vkládal svůj vlastní API klíč. Z důvodu lepšího uživatelského zážitku (UX) byl tento systém upraven:
- Na straně klienta je natvrdo odesílán řetězec `"DUMMY"`.
- Backend při zachycení `"DUMMY"` použije serverový `GEMINI_API_KEY` z proměnných prostředí.
- Hráči tedy nemají přístup k samotnému klíči a všechny dotazy jsou směrovány přes backend administrátora.
