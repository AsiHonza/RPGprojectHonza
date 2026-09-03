import os
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai

load_dotenv()

supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

# Global genai client or we can let endpoints instantiate it
# client = genai.Client(api_key=os.environ.get('GEMINI_API_KEY'))
