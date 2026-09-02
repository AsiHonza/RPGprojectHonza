import codecs
with codecs.open("next.config.ts", "r", "utf-8") as f:
    c = f.read()
c = c.replace('eslint:', '// eslint:')
with codecs.open("next.config.ts", "w", "utf-8") as f:
    f.write(c)
