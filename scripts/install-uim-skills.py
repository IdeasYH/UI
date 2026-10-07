"""Install all three explicit-only skills without replacing existing installations."""
import argparse
import os
from pathlib import Path
import shutil

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--target', type=Path, default=Path(os.environ.get('CODEX_HOME', str(Path.home() / '.codex'))) / 'skills')
args = parser.parse_args()
source = Path(__file__).resolve().parent
names = ['uim-browse', 'uim-auto', 'uim-id']
for name in names:
    if not (source / name / 'SKILL.md').is_file():
        parser.error('请在解压后的分享包中运行 install.py。')
    if (args.target / name).exists():
        parser.error(f'{args.target / name} 已存在；本次安装不会自动覆盖或更新。')
for name in names:
    shutil.copytree(source / name, args.target / name)
print('Installed: ' + ', '.join(names))
print('重新打开技能列表或新建对话，输入 $uim 搜索三个入口。')
