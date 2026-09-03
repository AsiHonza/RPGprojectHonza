import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
res = supabase.table("characters").select("history").eq("name", "testak Honza").execute()
if res.data:
    text = res.data[0]['history'][0]['text']
    print("Type of text:", type(text))
    print("Repr of text:", repr(text))
