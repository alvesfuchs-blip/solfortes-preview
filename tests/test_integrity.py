"""Offline link, accessibility-contract and capture-OFF regression gates."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import hashlib
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids = []
        self.targets = []
        self.elements = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        self.targets.extend(attrs[key] for key in ('href', 'src') if key in attrs)

PAGES = {path.resolve(): Page(path.read_text()) for path in ROOT.rglob('*.html') if '.git' not in path.parts}

class IntegrityTests(unittest.TestCase):
    def test_local_links_and_fragments(self):
        count = 0
        for path, page in PAGES.items():
            for target in page.targets:
                url = urlsplit(target)
                self.assertNotIn(url.scheme, ('javascript', 'data'), (path, target))
                if url.scheme or url.netloc:
                    continue
                count += 1
                dest = ((ROOT / unquote(url.path).lstrip('/')) if url.path.startswith('/') else path.parent / unquote(url.path)).resolve() if url.path else path
                self.assertTrue(dest.is_relative_to(ROOT), (path, target))
                if dest.is_dir():
                    dest /= 'index.html'
                self.assertTrue(dest.exists(), (path, target))
                if url.fragment and dest in PAGES:
                    self.assertIn(unquote(url.fragment), PAGES[dest].ids, (path, target))
        print(f'Checked {len(PAGES)} pages and {count} local link/asset targets')

    def test_unique_ids_and_language(self):
        for path, page in PAGES.items():
            self.assertEqual(len(page.ids), len(set(page.ids)), path)
            html = next(attrs for tag, attrs in page.elements if tag == 'html')
            self.assertEqual(html.get('lang'), 'pt-BR', path)

    def test_form_accessibility_contract(self):
        page = PAGES[ROOT / 'lp/solar-residencial/index.html']
        labels = {a.get('for') for tag, a in page.elements if tag == 'label'}
        for tag, attrs in page.elements:
            if tag in ('input', 'select', 'textarea'):
                self.assertIn(attrs.get('id'), labels)
                for reference in attrs.get('aria-describedby', '').split():
                    self.assertIn(reference, page.ids)
        status = next(a for _, a in page.elements if a.get('id') == 'status')
        self.assertEqual(status.get('role'), 'status')
        self.assertEqual(status.get('aria-live'), 'polite')
        self.assertEqual(status.get('tabindex'), '-1')

    def test_capture_off_every_page(self):
        for path, page in PAGES.items():
            # 404 is a static redirect without any interactive capture surface.
            if path.name == '404.html':
                continue
            csp = next(a['content'] for tag, a in page.elements if tag == 'meta' and a.get('http-equiv') == 'Content-Security-Policy')
            self.assertIn("connect-src 'none'", csp)
            self.assertIn("form-action 'none'", csp)
            for tag, attrs in page.elements:
                if tag == 'script':
                    self.assertFalse(urlsplit(attrs.get('src', '')).scheme)
                if tag == 'form':
                    self.assertNotIn('action', attrs)
        source = (ROOT / 'lp/solar-residencial/app.js').read_text()
        self.assertIn('LPCore.preview(data)', source)
        self.assertNotIn('createSimulation', source)
        for filename in ('app.js', 'core.js'):
            source = (ROOT / 'lp/solar-residencial' / filename).read_text()
            for forbidden in ('fetch(', 'XMLHttpRequest', 'sendBeacon', 'localStorage', 'sessionStorage', 'WebSocket'):
                self.assertNotIn(forbidden, source)

    def test_manifest_hashes(self):
        manifest = json.loads((ROOT / 'deployment-manifest.json').read_text())
        self.assertIs(manifest['captureEnabled'], False)
        for filename, expected in manifest['files'].items():
            self.assertEqual(hashlib.sha256((ROOT / filename).read_bytes()).hexdigest(), expected, filename)

if __name__ == '__main__':
    unittest.main()
