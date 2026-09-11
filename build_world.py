#!/usr/bin/env python3
"""
build_world.py – Obsidian Vault → JSON Game Data Pipeline

Reads all markdown files from the Aelthgard/ vault, parses YAML frontmatter,
and generates JSON files for the game engine.

Output files (written to ai-rpg-backend/app/data/generated/):
  - world_map.json    : Node topology for SVG map and travel engine
  - npcs.json         : NPC data with dialogs, trade items, relationships
  - quests.json       : Quest definitions with steps, branches, flags
  - lore_context.json : Compressed lore for Gemini prompt injection
  - factions.json     : Faction data with diplomatic relations

Usage:
  python build_world.py                     # from project root
  python build_world.py --vault ./Aelthgard # specify vault path
"""

import os
import sys
import re
import json
import yaml
import argparse
from pathlib import Path
from typing import Any

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def parse_frontmatter(filepath: Path) -> tuple[dict, str]:
    """Parse YAML frontmatter and markdown body from a file."""
    text = filepath.read_text(encoding='utf-8')
    # Strip UTF-8 BOM if present (PowerShell Set-Content writes BOM)
    text = text.lstrip('\ufeff')
    
    # Match YAML frontmatter between --- delimiters
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', text, re.DOTALL)
    if not match:
        return {}, text
    
    try:
        meta = yaml.safe_load(match.group(1)) or {}
    except yaml.YAMLError as e:
        print(f"  ⚠️  YAML error in {filepath.name}: {e}")
        meta = {}
    
    body = match.group(2)
    return meta, body


def extract_yaml_blocks(body: str) -> dict[str, Any]:
    """Extract named YAML code blocks from markdown body."""
    results = {}
    # Match ```yaml blocks and extract their content
    pattern = r'```yaml\s*\n(.*?)\n```'
    blocks = re.findall(pattern, body, re.DOTALL)
    
    for block in blocks:
        try:
            parsed = yaml.safe_load(block)
            if isinstance(parsed, dict):
                results.update(parsed)
        except yaml.YAMLError:
            continue
    
    return results


def extract_description(body: str) -> str:
    """Extract the first substantial paragraph after ## Atmosféra/Popis as base description."""
    # Try to find Atmosféra section first, then Popis
    for header in ['## Atmosféra a Vizuál', '## Popis', '## Atmosféra']:
        idx = body.find(header)
        if idx != -1:
            after = body[idx + len(header):]
            # Get text until next ## header or end
            next_header = re.search(r'\n## ', after)
            section = after[:next_header.start()] if next_header else after
            # Strip HTML comments and clean up
            section = re.sub(r'<!--.*?-->', '', section, flags=re.DOTALL)
            lines = [l.strip() for l in section.strip().split('\n') if l.strip() and not l.strip().startswith('#')]
            if lines:
                return ' '.join(lines)
    
    # Fallback: first paragraph after the title
    lines = [l.strip() for l in body.split('\n') if l.strip() and not l.strip().startswith('#') and not l.strip().startswith('**') and not l.strip().startswith('<!--')]
    return lines[0] if lines else ''


def strip_wikilinks(text: str) -> str:
    """Convert [[Link|Display]] or [[Link]] to plain text."""
    text = re.sub(r'\[\[([^|\]]+)\|([^\]]+)\]\]', r'\2', text)
    text = re.sub(r'\[\[([^\]]+)\]\]', r'\1', text)
    return text


def extract_section_lines(body: str, headers: list[str]) -> list[str]:
    """Extract bullet points or lines under specified markdown headers."""
    for header in headers:
        idx = body.find(header)
        if idx != -1:
            after = body[idx + len(header):]
            next_h = re.search(r'\n## ', after)
            section = after[:next_h.start()] if next_h else after
            lines = [strip_wikilinks(l.strip().lstrip('-*•')).strip() for l in section.strip().split('\n') if l.strip().startswith(('-', '*', '•'))]
            if lines:
                return lines
    return []


def build_locations(vault_path: Path) -> list[dict]:
    """Build location nodes from 📍 Locations/ directory, nesting POIs into sub_locations."""
    macro_locations = {}
    sub_locations_by_parent = {}
    loc_dir = vault_path / '📍 Locations'
    
    if not loc_dir.exists():
        print("  ⚠️  📍 Locations/ directory not found")
        return []
    
    for md_file in loc_dir.rglob('*.md'):
        meta, body = parse_frontmatter(md_file)
        
        node_id = meta.get('node_id')
        if not node_id:
            # Generate from filename
            node_id = md_file.stem.lower().replace(' ', '_')
            node_id = re.sub(r'[^a-z0-9_]', '', node_id.encode('ascii', 'ignore').decode())
        
        description = extract_description(body)
        yaml_blocks = extract_yaml_blocks(body)
        
        secrets = meta.get('secrets') or yaml_blocks.get('secrets') or extract_section_lines(body, [
            '## 🗝️ Tajemství a Skrytý Loot', '## Tajemství a Skrytý Loot',
            '## 🗝️ Tajemství a Role v Příběhu', '## Tajemství a Role v Příběhu',
            '## 🗝️ Tajemství', '## Tajemství'
        ])
        loot_containers = meta.get('loot_containers') or yaml_blocks.get('loot_containers') or []
        
        parent_raw = meta.get('parent_location') or ''
        parent_id = strip_wikilinks(str(parent_raw)).strip().lower() if parent_raw else None
        
        # Check if file is in a PointsOfInterest subfolder
        is_sublocation = bool(parent_id) or ('PointsOfInterest' in md_file.parts)
        if not parent_id and 'PointsOfInterest' in md_file.parts:
            # Parent is directory above PointsOfInterest
            parent_dir = md_file.parent.parent
            parent_id = parent_dir.name.lower()
        
        node_data = {
            'id': node_id,
            'name': meta.get('title', md_file.stem),
            'type': meta.get('type', 'divocina').split('/')[0].strip().lower(),
            'x': meta.get('map_x', 50),
            'y': meta.get('map_y', 50),
            'connections': meta.get('connections_ids', []),
            'description': strip_wikilinks(description),
            'faction_id': meta.get('faction_id', ''),
            'kingdom_id': meta.get('kingdom_id', 0),
            'npcs': meta.get('npcs', []),
            'quests': meta.get('quests', []),
            'secrets': secrets,
            'loot_containers': loot_containers,
            'sub_locations': [],
            'default_actions': yaml_blocks.get('default_actions', [
                'Prozkoumat okolí', 'Podívat se po lidech', 'Rozbít tábor'
            ]),
            'encounters': yaml_blocks.get('encounters', []),
            'source_file': str(md_file.relative_to(vault_path))
        }

        if is_sublocation and parent_id:
            sub_locations_by_parent.setdefault(parent_id, []).append(node_data)
            print(f"  🏢 POI: {node_data['name']} ({node_id}) -> Parent: {parent_id}")
        else:
            macro_locations[node_id] = node_data
            print(f"  📍 Macro Node: {node_data['name']} ({node_id})")
    
    # Attach sub_locations to their macro parents
    for parent_id, subs in sub_locations_by_parent.items():
        if parent_id in macro_locations:
            macro_locations[parent_id]['sub_locations'] = subs
        else:
            # If parent not found, keep sub-locations as standalone
            for sub in subs:
                macro_locations[sub['id']] = sub

    return list(macro_locations.values())


def build_npcs(vault_path: Path) -> list[dict]:
    """Build NPC data from 👥 Characters/ directory."""
    npcs = []
    char_dir = vault_path / '👥 Characters'
    
    if not char_dir.exists():
        print("  ⚠️  👥 Characters/ directory not found")
        return npcs
    
    for md_file in char_dir.rglob('*.md'):
        meta, body = parse_frontmatter(md_file)
        if 'npc' not in meta.get('tags', []):
            continue
        
        npc_id = meta.get('npc_id')
        if not npc_id:
            npc_id = md_file.stem.lower().replace(' ', '_')
            npc_id = re.sub(r'[^a-z0-9_]', '', npc_id.encode('ascii', 'ignore').decode())
        
        yaml_blocks = extract_yaml_blocks(body)
        
        # Extract personality and motivation from markdown sections
        personality = ''
        motivation = ''
        appearance = ''
        for section_name, target in [('## Osobnost', 'personality'), ('## Motivace', 'motivation'), ('## Vzhled', 'appearance')]:
            idx = body.find(section_name)
            if idx != -1:
                after = body[idx + len(section_name):]
                next_h = re.search(r'\n## ', after)
                text = after[:next_h.start()] if next_h else after
                text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL).strip()
                text = strip_wikilinks(text)
                if target == 'personality':
                    personality = text
                elif target == 'motivation':
                    motivation = text
                elif target == 'appearance':
                    appearance = text
        
        npc = {
            'npc_id': npc_id,
            'name': meta.get('title', md_file.stem),
            'location_id': meta.get('location_id', ''),
            'gender': meta.get('gender', 'muz'),
            'type': meta.get('type', 'neutral'),
            'disposition': meta.get('disposition', 'neutral'),
            'faction_id': meta.get('faction_id', ''),
            'quests': meta.get('quests', []),
            'trade_items': meta.get('trade_items', []),
            'appearance': appearance,
            'personality': personality,
            'motivation': motivation,
            'dialog_greeting': yaml_blocks.get('dialog_greeting', {}),
            'dialog_topics': yaml_blocks.get('dialog_topics', []),
            'dialog_quest': yaml_blocks.get('dialog_quest', {}),
            'source_file': str(md_file.relative_to(vault_path))
        }
        
        npcs.append(npc)
        print(f"  👤 {npc['name']} ({npc_id})")
    
    return npcs


def build_quests(vault_path: Path) -> list[dict]:
    """Build quest data from 📜 Quests/ directory."""
    quests = []
    quest_dir = vault_path / '📜 Quests'
    
    if not quest_dir.exists():
        print("  ⚠️  📜 Quests/ directory not found")
        return quests
    
    for md_file in quest_dir.rglob('*.md'):
        meta, body = parse_frontmatter(md_file)
        if 'quest' not in meta.get('tags', []):
            continue
        
        yaml_blocks = extract_yaml_blocks(body)
        
        quest = {
            'quest_id': meta.get('quest_id', md_file.stem),
            'title': meta.get('title', md_file.stem),
            'type': meta.get('type', 'side'),
            'giver_id': meta.get('giver_id', ''),
            'start_location_id': meta.get('start_location_id', ''),
            'target_location_ids': meta.get('target_location_ids', []),
            'prerequisite_quests': meta.get('prerequisite_quests', []),
            'prerequisite_flags': meta.get('prerequisite_flags', []),
            'kingdom_id': meta.get('kingdom_id', 0),
            'level_range': meta.get('level_range', '1-20'),
            'reward': meta.get('reward', {'gold': 0, 'xp': 0, 'items': []}),
            'steps': yaml_blocks.get('steps', []),
            'branches': yaml_blocks.get('branches', {}),
            'source_file': str(md_file.relative_to(vault_path))
        }
        
        quests.append(quest)
        print(f"  📜 {quest['title']} ({quest['quest_id']})")
    
    return quests


def build_factions(vault_path: Path) -> list[dict]:
    """Build faction data from 🌍 World/Factions/ directory."""
    factions = []
    fac_dir = vault_path / '🌍 World' / 'Factions'
    
    if not fac_dir.exists():
        return factions
    
    for md_file in fac_dir.rglob('*.md'):
        meta, body = parse_frontmatter(md_file)
        
        faction_id = meta.get('faction_id')
        if not faction_id:
            faction_id = md_file.stem.lower().replace(' ', '_')
            faction_id = re.sub(r'[^a-z0-9_]', '', faction_id.encode('ascii', 'ignore').decode())
        
        description = extract_description(body)
        yaml_blocks = extract_yaml_blocks(body)
        
        faction = {
            'faction_id': faction_id,
            'name': meta.get('title', md_file.stem),
            'kingdom_id': meta.get('kingdom_id', 0),
            'leader': strip_wikilinks(str(meta.get('leader', 'Neznámý'))),
            'capital': strip_wikilinks(str(meta.get('capital', 'Neznámé'))),
            'religion': strip_wikilinks(str(meta.get('religion', 'Žádné'))),
            'attitude_towards_magic': meta.get('attitude_towards_magic', 'neutral'),
            'description': strip_wikilinks(description),
            'diplomatic_relations': meta.get('diplomatic_relations', []),
            'regions': meta.get('regions', []),
            'quest_chains': yaml_blocks.get('quest_chains', []),
            'source_file': str(md_file.relative_to(vault_path))
        }
        
        factions.append(faction)
        print(f"  🏛️ {faction['name']} ({faction_id})")
    
    return factions


def build_lore_context(vault_path: Path, factions: list, locations: list) -> dict:
    """Build compressed lore context for Gemini prompt injection."""
    context = {
        'world_tone': 'Mix Fable (pohádkový vizuál) a Zaklínače (dospělé morální volby, cynismus, následky).',
        'magic_rules': '',
        'religion': '',
        'kingdoms_summary': [],
        'current_region_template': 'Hráč se nachází v lokaci "{location_name}" ({location_type}). {location_description}'
    }
    
    # Read WorldRules
    rules_file = vault_path / '🌍 World' / 'WorldRules.md'
    if rules_file.exists():
        _, body = parse_frontmatter(rules_file)
        # Extract magic section
        idx = body.find('## 1. Magie a Probuzení')
        if idx != -1:
            after = body[idx:]
            next_h = re.search(r'\n## 2\.', after)
            context['magic_rules'] = strip_wikilinks(after[:next_h.start()].strip()) if next_h else strip_wikilinks(after.strip())
    
    # Read Religion
    rel_file = vault_path / '🌍 World' / 'Religion.md'
    if rel_file.exists():
        _, body = parse_frontmatter(rel_file)
        context['religion'] = strip_wikilinks(body.strip()[:800])  # Truncate for token efficiency
    
    # Summarize kingdoms
    for f in factions:
        context['kingdoms_summary'].append({
            'name': f['name'],
            'leader': f['leader'],
            'attitude_to_magic': f['attitude_towards_magic'],
            'one_liner': f['description'][:200] if f['description'] else ''
        })
    
    return context


def main():
    parser = argparse.ArgumentParser(description='Build game data from Obsidian vault')
    parser.add_argument('--vault', default='./Aelthgard', help='Path to Aelthgard vault')
    parser.add_argument('--output', default='./ai-rpg-backend/app/data/generated', help='Output directory')
    args = parser.parse_args()
    
    vault_path = Path(args.vault).resolve()
    output_path = Path(args.output).resolve()
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"\n🏗️  Aelthgard Build Pipeline")
    print(f"   Vault:  {vault_path}")
    print(f"   Output: {output_path}\n")
    
    # Build all data
    print("📍 Building locations...")
    locations = build_locations(vault_path)
    
    print("\n👥 Building NPCs...")
    npcs = build_npcs(vault_path)
    
    print("\n📜 Building quests...")
    quests = build_quests(vault_path)
    
    print("\n🏛️ Building factions...")
    factions = build_factions(vault_path)
    
    print("\n📚 Building lore context...")
    lore = build_lore_context(vault_path, factions, locations)
    
    # Write JSON files
    files = {
        'world_map.json': {node['id']: node for node in locations},
        'npcs.json': {npc['npc_id']: npc for npc in npcs},
        'quests.json': {q['quest_id']: q for q in quests},
        'factions.json': {f['faction_id']: f for f in factions},
        'lore_context.json': lore
    }
    
    frontend_output_path = Path('./ai-rpg-frontend/src/data/generated').resolve()
    frontend_output_path.mkdir(parents=True, exist_ok=True)

    print(f"\n💾 Writing JSON files to {output_path}/ and {frontend_output_path}/")
    for filename, data in files.items():
        # Backend
        filepath = output_path / filename
        filepath.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        # Frontend
        fe_filepath = frontend_output_path / filename
        fe_filepath.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f"   ✅ {filename} ({len(json.dumps(data, ensure_ascii=False))} bytes)")
    
    # Summary
    print(f"\n✨ Build complete!")
    print(f"   📍 {len(locations)} locations")
    print(f"   👤 {len(npcs)} NPCs")
    print(f"   📜 {len(quests)} quests")
    print(f"   🏛️ {len(factions)} factions")
    print()


if __name__ == '__main__':
    main()
