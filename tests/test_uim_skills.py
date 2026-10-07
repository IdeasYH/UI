import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('uim', ROOT / 'skills/uim-browse/scripts/uim.py')
uim = importlib.util.module_from_spec(spec)
spec.loader.exec_module(uim)
uim.ASSETS = ROOT / 'artifacts/uim-skills/uim-browse/assets'


class UIMTests(unittest.TestCase):
    def test_exact_id_and_name_resolve_same_component(self):
        item = uim.resolve_one('date-range')
        self.assertEqual(uim.resolve_one(item['name'])['id'], item['id'])

    def test_ambiguous_name_does_not_guess(self):
        with self.assertRaises(ValueError):
            uim.resolve_one('')

    def test_extract_complete_package_and_refuse_overwrite(self):
        with tempfile.TemporaryDirectory() as base:
            target = Path(base) / 'new'
            result = uim.extract('date-range', target)
            self.assertGreater(result['files'], 3)
            self.assertTrue((target / result['example']).is_file())
            self.assertTrue((target / 'src/components/ui/date-range-picker.css').is_file())
            self.assertTrue((target / 'uim-provenance.json').is_file())
            with self.assertRaises(ValueError):
                uim.extract('date-range', target)

    def test_corrupt_source_is_rejected_before_write(self):
        item = uim.resolve_one('date-range')
        bundle = json.loads((uim.ASSETS / item['package']).read_text(encoding='utf-8'))
        with tempfile.TemporaryDirectory() as base:
            assets = Path(base) / 'assets'
            package = assets / item['package']
            package.parent.mkdir(parents=True)
            bundle['files'][0]['content'] += 'tampered'
            package.write_text(json.dumps(bundle), encoding='utf-8')
            with patch.object(uim, 'ASSETS', assets), patch.object(uim, 'resolve_one', return_value=item):
                target = Path(base) / 'output'
                with self.assertRaises(ValueError):
                    uim.extract('date-range', target)
                self.assertFalse(target.exists())

    def test_share_site_excludes_personal_implementation(self):
        site = uim.ASSETS / 'site'
        self.assertFalse(list(site.rglob('*rosette*')))
        for path in (site / 'assets').glob('*.js'):
            self.assertNotIn('mountLuminaryCard', path.read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
