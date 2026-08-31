import codecs
import os
import re
import unicodedata

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# Make sure images dir exists
os.makedirs("images", exist_ok=True)

# Add StaticFiles import if not there
if "from fastapi.staticfiles import StaticFiles" not in content:
    content = content.replace("from fastapi.middleware.cors import CORSMiddleware", "from fastapi.middleware.cors import CORSMiddleware\nfrom fastapi.staticfiles import StaticFiles")

# Mount /images
if 'app.mount("/images"' not in content:
    content = content.replace('app = FastAPI(title="AI RPG Game Master API")', 'app = FastAPI(title="AI RPG Game Master API")\napp.mount("/images", StaticFiles(directory="images"), name="images")')

# Replace the base64 generation block with the caching logic
target_logic = """
        # --- GENERATE IMAGE ---
        img_key = os.environ.get("GEMINI_IMAGE_API_KEY")
        img_prompt = dm_json.get("image_prompt")
        
        if img_key and img_prompt:
            try:
                img_client = genai.Client(api_key=img_key)
                img_res = img_client.models.generate_images(
                    model='imagen-3.0-generate-002',
                    prompt=img_prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        output_mime_type="image/jpeg",
                        aspect_ratio="16:9"
                    )
                )
                if img_res.generated_images:
                    import base64
                    dm_json["image_base64"] = base64.b64encode(img_res.generated_images[0].image.image_bytes).decode('utf-8')
            except Exception as img_e:
                err_str = str(img_e).lower()
                if "429" in err_str or "exhausted" in err_str or "quota" in err_str:
                    dm_json["image_error"] = "Vyčerpán denní limit pro obrázky. Zobrazuji černé pozadí."
                else:
                    dm_json["image_error"] = f"Chyba generování obrázku: {str(img_e)}"
"""

replacement_logic = """
        # --- Caching and Image Generation ---
        import unicodedata
        import re
        
        region = dm_json.get("aktualni_region", "nezname_konciny")
        # Slugify: odstraneni diakritiky, na mala pismena, mezery na podtrzitka
        slug = unicodedata.normalize('NFKD', region).encode('ascii', 'ignore').decode('ascii')
        slug = re.sub(r'[^a-z0-9]+', '_', slug.lower()).strip('_')
        if not slug:
            slug = "lokace_bez_jmena"
            
        filename = f"{slug}.jpg"
        filepath = os.path.join("images", filename)
        
        # Check if already cached
        if os.path.exists(filepath):
            dm_json["image_url"] = f"http://127.0.0.1:8000/images/{filename}"
        else:
            img_key = os.environ.get("GEMINI_IMAGE_API_KEY")
            img_prompt = dm_json.get("image_prompt")
            if img_key and img_prompt:
                try:
                    img_client = genai.Client(api_key=img_key)
                    img_res = img_client.models.generate_images(
                        model='imagen-3.0-generate-002',
                        prompt=img_prompt,
                        config=types.GenerateImagesConfig(
                            number_of_images=1,
                            output_mime_type="image/jpeg",
                            aspect_ratio="16:9"
                        )
                    )
                    if img_res.generated_images:
                        image_bytes = img_res.generated_images[0].image.image_bytes
                        with open(filepath, "wb") as img_file:
                            img_file.write(image_bytes)
                        dm_json["image_url"] = f"http://127.0.0.1:8000/images/{filename}"
                except Exception as img_e:
                    err_str = str(img_e).lower()
                    if "429" in err_str or "exhausted" in err_str or "quota" in err_str:
                        dm_json["image_error"] = "Vyčerpán denní limit pro obrázky."
                    else:
                        dm_json["image_error"] = f"Chyba: {str(img_e)}"
"""
content = content.replace(target_logic, replacement_logic)

# Add image_url to DMResponse schema
content = content.replace("image_base64: Optional[str] = None", "image_url: Optional[str] = None\n    image_base64: Optional[str] = None")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Caching logic applied to backend!")
