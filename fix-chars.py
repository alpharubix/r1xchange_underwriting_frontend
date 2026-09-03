import os
import glob

replacements = {
    'â€¢': '•',
    'â”€': '─',
    'â† ': '←',
    'â‚¹': '₹',
    'Â©': '©',
    'â€™': '’',
    'â—Œ': '○',
    'â†’': '→',
    'ðŸ–¤': '🖤'
}

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for k, v in replacements.items():
                    new_content = new_content.replace(k, v)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {filepath}")
            except Exception as e:
                print(f"Could not process {filepath}: {e}")
