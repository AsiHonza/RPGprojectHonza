import os
import json
from supabase import create_client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
from dotenv import load_dotenv
load_dotenv()

supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
res = supabase.table("characters").select("*").limit(1).execute()
print(json.dumps(res.data[0] if res.data else {}, indent=2))
