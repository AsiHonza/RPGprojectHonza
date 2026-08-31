import codecs

with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    content = f.read()

# Update playAction
old_play_action = '''body: JSON.stringify({
        api_key: apiKey,
        action_text: text,
        stats: stats,
        level: level,
        skills: []
      }),'''
new_play_action = '''body: JSON.stringify({
        api_key: apiKey,
        name: name,
        action_text: text,
        stats: stats,
        level: level,
        skills: []
      }),'''
content = content.replace(old_play_action, new_play_action)

# Update saveState
old_save_state = '''body: JSON.stringify({
        api_key: apiKey,
        state: stateToSave
      })'''
new_save_state = '''body: JSON.stringify({
        api_key: apiKey,
        name: name,
        state: stateToSave
      })'''
content = content.replace(old_save_state, new_save_state)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write(content)
print("Frontend updated - Part 2.")
