import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

target = "response_schema=DMResponse,"
replacement = """response_schema=DMResponse, # We will replace this below"""

# We need to clean the schema
patch = """
def clean_schema(schema: dict):
    if isinstance(schema, dict):
        if "additionalProperties" in schema:
            del schema["additionalProperties"]
        for k, v in schema.items():
            clean_schema(v)
    elif isinstance(schema, list):
        for item in schema:
            clean_schema(item)
    return schema

dm_schema_dict = DMResponse.model_json_schema()
clean_schema(dm_schema_dict)
"""

if "def clean_schema" not in content:
    content = content.replace("class DMResponse(BaseModel):", patch + "\nclass DMResponse(BaseModel):")
    content = content.replace("response_schema=DMResponse,", "response_schema=dm_schema_dict,")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Schema fixed!")
