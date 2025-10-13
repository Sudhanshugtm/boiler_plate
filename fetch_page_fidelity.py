#!/usr/bin/env python3
# /// script
# dependencies = ['beautifulsoup4', 'lxml']
# ///

"""Experimental fetcher that preserves Wikipedia scripts/styles for fidelity testing."""

import argparse
import urllib.parse
import urllib.request
from bs4 import BeautifulSoup


def fetch_wikipedia_page(url: str) -> str:
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return response.read().decode('utf-8')


def absolutize_url(value: str, base: str) -> str:
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


def rewrite_srcset(value: str, base: str) -> str:
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


def process_html_with_remote_assets(html: str, base: str) -> str:
    soup = BeautifulSoup(html, 'lxml')

    # Rewrite resource references to absolute Wikipedia URLs
    for tag_name, attrs in RESOURCE_ATTRS.items():
        for tag in soup.find_all(tag_name):
            for attr in attrs:
                if not tag.has_attr(attr):
                    continue
                if attr == 'srcset':
                    tag[attr] = rewrite_srcset(tag[attr], base)
                else:
                    tag[attr] = absolutize_url(tag[attr], base)

    # Inject our prototype helpers unless already present
    body = soup.find('body')
    if body:
        injected = {
            '../assets/js/dropdowns.js',
            '../assets/js/tabs.js',
            '../assets/js/search.js',
            '../assets/js/variants.js',
            '../assets/js/main.js',
        }
        existing = {tag.get('src') for tag in body.find_all('script') if tag.get('src')}
        for script_path in injected - existing:
            script_tag = soup.new_tag('script', src=script_path)
            script_tag['defer'] = True
            body.append(script_tag)

    return str(soup)


def derive_output_name(url: str) -> str:
    page_name = url.split('/wiki/')[-1].replace('%', '_').replace(':', '_')
    return f"pages/{page_name[:50]}.html"


def main() -> None:
    parser = argparse.ArgumentParser(description='Fetch Wikipedia page preserving remote assets (fidelity mode)')
    parser.add_argument('--url')
    parser.add_argument('--lang', default='en')
    parser.add_argument('--page')
    parser.add_argument('--output')

    args = parser.parse_args()

    if args.url:
        url = args.url
    elif args.page:
        encoded_page = urllib.parse.quote(args.page)
        url = f"https://{args.lang}.wikipedia.org/wiki/{encoded_page}"
    else:
        raise SystemExit('Provide either --url or --page')

    parsed = urllib.parse.urlparse(url)
    base = f"{parsed.scheme}://{parsed.netloc}"
    output_path = args.output or derive_output_name(url)

    html = fetch_wikipedia_page(url)
    processed_html = process_html_with_remote_assets(html, base)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(processed_html)

    print(f"✓ Created (fidelity): {output_path}")
    print(f"  Remote base: {base}")
    print(f"  Size: {len(processed_html)} bytes")


if __name__ == '__main__':
    main()
