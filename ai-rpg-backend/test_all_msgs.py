import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
res = supabase.table("characters").select("history").eq("name", "testak Honzak").execute()
if res.data:
    for i, msg in enumerate(res.data[0]['history']):
        if msg['role'] == 'model':
            print(f"Testing message {i}...")
            # Simulate JS JSON.parse
            # We can just try to json.loads it since Python's json.loads is equivalent to JSON.parse
            try:
                data = json.loads(msg['text'])
                print(f"Message {i} parsed successfully!")
            except Exception as e:
                print(f"Message {i} FAILED: {e}")
                print("RAW TEXT:")
                print(repr(msg['text']))
