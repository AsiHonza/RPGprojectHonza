import codecs

with codecs.open('main.py', 'r', 'utf-8') as f:
    lines = f.readlines()

# The clean second half starts at line 358 with @app.get('/tts')
# Let's find the 'app = FastAPI' in the first half.
# Actually, lines 1 to 151 (right before the first @app.get('/tts')) are perfectly fine!
# Let's check lines 1 to 151.
