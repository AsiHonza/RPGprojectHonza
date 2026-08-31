import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# Add fields to DMResponse
target_dm = """    nepratele: List[dict] = []
    dulezita_fakta: List[str] = Field(default=[])"""

replacement_dm = """    nepratele: List[dict] = []
    dulezita_fakta: List[str] = Field(default=[])
    image_base64: Optional[str] = None
    image_error: Optional[str] = None"""
content = content.replace(target_dm, replacement_dm)

# Image generation logic after text generation
target_logic = """        # Ulozeni novych dulezitych faktu do dlouhodobe pameti"""
replacement_logic = """
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
                    
        # Ulozeni novych dulezitych faktu do dlouhodobe pameti"""
content = content.replace(target_logic, replacement_logic)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("main.py image logic added!")
