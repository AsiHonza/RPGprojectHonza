import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# Remove the broken dict generation
content = content.replace("dm_schema_dict = DMResponse.model_json_schema()\nclean_schema(dm_schema_dict)\n", "")

# Add it after DMResponse
target = "class AuthRequest(BaseModel):"
replacement = "dm_schema_dict = DMResponse.model_json_schema()\nclean_schema(dm_schema_dict)\n\nclass AuthRequest(BaseModel):"
content = content.replace(target, replacement)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Schema definition moved!")
