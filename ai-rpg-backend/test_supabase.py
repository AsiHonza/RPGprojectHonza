import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

res = supabase.table("characters").select("history").eq("name", "testak Honza").execute()
if res.data:
    hist = res.data[0]['history']
    print("History length:", len(hist))
    if len(hist) > 0:
        print("First msg:", hist[0]['text'])
else:
    print("Character not found")
