#!/usr/bin/env python3
# /// script
# dependencies = ['beautifulsoup4', 'lxml']
# ///

# ABOUTME: Universal Wikipedia page fetcher - grabs any page from any language wiki
# ABOUTME: Processes and prepares it for static hosting with local assets

"""
Universal Wikipedia Page Fetcher

Usage:
    python3 fetch_page.py --url "https://hi.wikipedia.org/wiki/Page_Name"
    python3 fetch_page.py --url "https://en.wikipedia.org/wiki/Special:Contribute" --output contribute.html
    python3 fetch_page.py --lang hi --page "विशेष:Contribute"
"""

import argparse
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import re

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

def process_html(html_content, lang='en'):
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
                link['href'] = '../assets/css/wikipedia-site.css'
            else:
                link['href'] = '../assets/css/wikipedia-modules.css'

    # Add our custom JavaScript files at the end of body (with ../ for pages/ subdirectory)
    body = soup.find('body')
    if body:
        js_files = [
            '../assets/js/dropdowns.js',
            '../assets/js/tabs.js',
            '../assets/js/search.js',
            '../assets/js/variants.js',
            '../assets/js/main.js'
        ]

        for js_file in js_files:
            js_script = soup.new_tag('script', src=js_file)
            body.append(js_script)

    return soup.prettify()

def main():
    parser = argparse.ArgumentParser(description='Fetch and process Wikipedia pages')
    parser.add_argument('--url', help='Full Wikipedia URL')
    parser.add_argument('--lang', default='en', help='Language code (en, hi, fr, etc.)')
    parser.add_argument('--page', help='Page name (will be URL encoded)')
    parser.add_argument('--output', help='Output filename (default: derived from page name)')

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

    # Fetch and process
    html = fetch_wikipedia_page(url)
    processed_html = process_html(html, lang)

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(processed_html)

    print(f"✓ Created: {output_file}")
    print(f"  Language: {lang}")
    print(f"  Size: {len(processed_html)} bytes")

if __name__ == '__main__':
    main()
