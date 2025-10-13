#!/usr/bin/env python3
# /// script
# dependencies = ['beautifulsoup4', 'lxml']
# ///

# ABOUTME: Universal Wikipedia page fetcher - grabs any page from any language wiki
# ABOUTME: Processes and prepares it for static hosting with local assets

import argparse
import os
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import re

"""
Universal Wikipedia Page Fetcher

Usage:
    python3 fetch_page.py --url "https://hi.wikipedia.org/wiki/Page_Name"
    python3 fetch_page.py --url "https://en.wikipedia.org/wiki/Special:Contribute" --output contribute.html
    python3 fetch_page.py --lang hi --page "विशेष:Contribute"
"""

MODE_PROTOTYPE = 'prototype'
MODE_FIDELITY = 'fidelity'
MODES = [MODE_PROTOTYPE, MODE_FIDELITY]
RESOURCE_ATTRS = {
    'link': ('href',),
    'script': ('src',),
    'img': ('src', 'srcset'),
    'source': ('src', 'srcset'),
    'audio': ('src',),
    'video': ('src', 'poster'),
    'track': ('src',),
    'iframe': ('src',),
    'use': ('href', 'xlink:href'),
}

def fetch_wikipedia_page(url):
    """Fetch HTML from Wikipedia URL"""
    print(f"Fetching: {url}")
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return response.read().decode('utf-8')

def extract_language_from_url(url):
    """Extract language code from Wikipedia URL"""
    match = re.match(r'https://([a-z]+)\.wikipedia\.org', url)
    return match.group(1) if match else 'en'

def absolutize_url(value, base):
    """Convert protocol-relative or root-relative URLs to absolute ones"""
    if not value:
        return value
    lower = value.lower()
    if lower.startswith(('http://', 'https://', 'data:', 'javascript:', 'mailto:', '#')):
        return value
    if value.startswith('//'):
        return 'https:' + value
    if value.startswith('/'):
        return base + value
    return value

def rewrite_srcset(value, base):
    rewritten = []
    for item in value.split(','):
        item = item.strip()
        if not item:
            continue
        if ' ' in item:
            url, descriptor = item.split(' ', 1)
            rewritten.append(f"{absolutize_url(url.strip(), base)} {descriptor.strip()}")
        else:
            rewritten.append(absolutize_url(item, base))
    return ', '.join(rewritten)

def process_html_prototype(html_content, asset_prefix):
    """Process and clean HTML for static hosting"""
    soup = BeautifulSoup(html_content, 'lxml')

    # Remove all script tags
    for script in soup.find_all('script'):
        script.decompose()

    # Update CSS links to point to local files (with ../ for pages/ subdirectory)
    css_links = soup.find_all('link', rel='stylesheet')
    for link in css_links:
        href = link.get('href', '')
        if 'load.php' in href and 'only=styles' in href:
            if 'site.styles' in href:
                link['href'] = f'{asset_prefix}/css/wikipedia-site.css'
            else:
                link['href'] = f'{asset_prefix}/css/wikipedia-modules.css'

    # Add our custom JavaScript files at the end of body (with ../ for pages/ subdirectory)
    body = soup.find('body')
    if body:
        js_files = [
            f'{asset_prefix}/js/dropdowns.js',
            f'{asset_prefix}/js/tabs.js',
            f'{asset_prefix}/js/search.js',
            f'{asset_prefix}/js/variants.js',
            f'{asset_prefix}/js/main.js'
        ]

        for js_file in js_files:
            js_script = soup.new_tag('script', src=js_file)
            body.append(js_script)

    return soup.prettify()

def process_html_fidelity(html_content, asset_prefix, base):
    """Preserve live Wikipedia assets and ensure resource URLs work from static hosting"""
    soup = BeautifulSoup(html_content, 'lxml')

    # Absolutize all resource URLs that would otherwise break off the origin
    for tag_name, attrs in RESOURCE_ATTRS.items():
        for tag in soup.find_all(tag_name):
            for attr in attrs:
                if not tag.has_attr(attr):
                    continue
                if attr == 'srcset':
                    tag[attr] = rewrite_srcset(tag[attr], base)
                else:
                    tag[attr] = absolutize_url(tag[attr], base)

    body = soup.find('body')
    if body:
        injected_paths = {
            f'{asset_prefix}/js/dropdowns.js',
            f'{asset_prefix}/js/tabs.js',
            f'{asset_prefix}/js/search.js',
            f'{asset_prefix}/js/variants.js',
            f'{asset_prefix}/js/main.js'
        }
        existing_paths = {
            tag.get('src') for tag in body.find_all('script') if tag.get('src')
        }
        for script_path in injected_paths - existing_paths:
            script_tag = soup.new_tag('script', src=script_path)
            script_tag['defer'] = True
            body.append(script_tag)

    return str(soup)

def process_html(html_content, mode, asset_prefix, base=None):
    if mode == MODE_FIDELITY:
        if not base:
            raise ValueError('Fidelity mode requires base URL context')
        return process_html_fidelity(html_content, asset_prefix, base)
    return process_html_prototype(html_content, asset_prefix)

def main():
    parser = argparse.ArgumentParser(description='Fetch and process Wikipedia pages')
    parser.add_argument('--url', help='Full Wikipedia URL')
    parser.add_argument('--lang', default='en', help='Language code (en, hi, fr, etc.)')
    parser.add_argument('--page', help='Page name (will be URL encoded)')
    parser.add_argument('--output', help='Output filename (default: derived from page name)')
    parser.add_argument('--mode', choices=MODES, default=MODE_PROTOTYPE,
                        help='prototype (default) strips live scripts; fidelity preserves live Wikipedia assets')

    args = parser.parse_args()

    # Construct URL
    if args.url:
        url = args.url
        lang = extract_language_from_url(url)
    elif args.page:
        encoded_page = urllib.parse.quote(args.page)
        url = f"https://{args.lang}.wikipedia.org/wiki/{encoded_page}"
        lang = args.lang
    else:
        print("Error: Provide either --url or --page")
        return

    # Determine output filename
    if args.output:
        output_file = args.output
    else:
        page_name = url.split('/wiki/')[-1].replace('%', '_').replace(':', '_')
        output_file = f"pages/{page_name[:50]}.html"

    output_dir = os.path.dirname(output_file) or '.'
    asset_prefix = os.path.relpath('assets', output_dir)

    # Fetch and process
    html = fetch_wikipedia_page(url)

    parsed_url = urllib.parse.urlparse(url)
    base = f"{parsed_url.scheme}://{parsed_url.netloc}"

    processed_html = process_html(html, args.mode, asset_prefix, base=base if args.mode == MODE_FIDELITY else None)

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(processed_html)

    print(f"✓ Created: {output_file}")
    print(f"  Language: {lang}")
    print(f"  Size: {len(processed_html)} bytes")
    print(f"  Mode: {args.mode}")

if __name__ == '__main__':
    main()
