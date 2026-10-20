import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class DeploymentTests(unittest.TestCase):
 def test_team_placeholders(self):
  html=(ROOT/'index.html').read_text()
  for role in ('technician','consultant','operations'):
   self.assertIn('aria-disabled="true" data-role="'+role+'"',html)
  self.assertIn('Encontre seu caminho',html)
  self.assertTrue(all(v is None for v in json.loads((ROOT/'team-entry.config.json').read_text())['destinations'].values()))
 def test_headers(self):
  conf=json.loads((ROOT/'vercel.json').read_text())
  headers={h['key']:h['value'] for h in conf['headers'][0]['headers']}
  self.assertEqual(headers['X-Robots-Tag'],'noindex, nofollow')
  self.assertIn("connect-src 'none'",headers['Content-Security-Policy'])
  self.assertIn("form-action 'none'",headers['Content-Security-Policy'])
 def test_capture_disabled(self):
  self.assertIn('event.preventDefault()', (ROOT/'lp/solar-residencial/app.js').read_text())
  self.assertIn("state:'disabled'",(ROOT/'lp/solar-residencial/core.js').read_text())
 def test_routes_palette(self):
  self.assertTrue((ROOT/'index.html').exists())
  self.assertTrue((ROOT/'lp/solar-residencial/index.html').exists())
  css=(ROOT/'assets/style.css').read_text().lower()
  for color in ['#ff6d24','#4e413b','#857671','#e2ded3','#201e1e']:self.assertIn(color,css)
if __name__=='__main__':unittest.main()
