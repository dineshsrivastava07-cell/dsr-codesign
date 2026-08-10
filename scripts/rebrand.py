#!/usr/bin/env python3
"""
WHAT: Mass rebranding script — replace all open-codesign/OpenCoworkAI references with dsr-codesign/DSR AI Lab
WHY: Forking open-codesign as dsr-codesign for DSR AI Lab, remove original org branding
INTERFACE: Run directly: python3 scripts/rebrand.py from repo root
DECISIONS: Ordered replacements (longest/most-specific first) to avoid partial-match corruption
CONVENTIONS: Replace in all text files; skip .git, node_modules, pnpm-lock.yaml, binary files
ASSERTIONS: After run, grep for 'open-codesign' should return only pnpm-lock.yaml and this script itself
RETRY: 1/3
"""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SKIP_DIRS = {'.git', 'node_modules', '.pnpm-store'}
SKIP_FILES = {'pnpm-lock.yaml', 'rebrand.py'}

# Order matters: most-specific first to avoid partial overwrites
REPLACEMENTS = [
    # package scopes
    ('@open-codesign/', '@dsr-codesign/'),
    # app-id / bundle id
    ('ai.opencowork.codesign', 'ai.dsrailab.codesign'),
    # org references
    ('OpenCoworkAI', 'DSR-AI-Lab'),
    ('opencoworkai', 'dsrailab'),
    # email addresses
    ('maintainers@opencowork.ai', 'team@dsrailab.com'),
    ('security@opencowork.ai', 'security@dsrailab.com'),
    ('conduct@opencowork.ai', 'conduct@dsrailab.com'),
    ('team@opencowork.ai', 'team@dsrailab.com'),
    # domains
    ('opencowork.ai', 'dsrailab.com'),
    # product names (title-case before lowercase)
    ('Open CoDesign', 'DSR CoDesign'),
    ('Open CoWork AI', 'DSR AI Lab'),
    ('Open CoWork', 'DSR AI Lab'),
    ('OpenCoDesign', 'DSRCoDesign'),
    # package / config names
    ('open-codesign', 'dsr-codesign'),
    # remaining lowercase org slug
    ('opencowork', 'dsrailab'),
]

BINARY_EXTENSIONS = {
    '.png', '.ico', '.icns', '.jpg', '.jpeg', '.gif', '.webp',
    '.woff', '.woff2', '.ttf', '.otf', '.eot',
    '.pdf', '.zip', '.tar', '.gz', '.bz2',
    '.exe', '.dmg', '.AppImage', '.deb', '.rpm',
    '.node', '.so', '.dylib', '.dll',
    '.lock',  # pnpm-lock.yaml handled by SKIP_FILES
}


def should_skip_file(path: str) -> bool:
    filename = os.path.basename(path)
    if filename in SKIP_FILES:
        return True
    _, ext = os.path.splitext(filename)
    if ext.lower() in BINARY_EXTENSIONS:
        return True
    return False


def process_file(path: str) -> bool:
    try:
        with open(path, 'r', encoding='utf-8', errors='strict') as f:
            original = f.read()
    except (UnicodeDecodeError, PermissionError):
        return False  # skip binary / unreadable

    content = original
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    changed = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # Prune skipped directories in-place
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            if should_skip_file(filepath):
                continue
            if process_file(filepath):
                rel = os.path.relpath(filepath, ROOT)
                changed.append(rel)
                print(f'  updated: {rel}')

    print(f'\nDone — {len(changed)} files updated.')


if __name__ == '__main__':
    main()
