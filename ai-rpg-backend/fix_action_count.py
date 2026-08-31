import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

# We need to find where nabizene_akce is defined.
# It might be in the system prompt or JSON schema.
# Let's see what is there.
