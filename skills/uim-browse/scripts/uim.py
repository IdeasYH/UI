"""Offline UIModel snapshot tools. Python standard library; no installs/network fetches."""
import argparse
import functools
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit
from urllib.request import urlopen
import webbrowser

ASSETS = Path(__file__).resolve().parents[1] / 'assets'


def catalog():
    return json.loads((ASSETS / 'catalog.json').read_text(encoding='utf-8'))


def matches(query):
    items = catalog()['components']
    exact = [item for item in items if query.casefold() in (item['id'].casefold(), item['name'].casefold())]
    return exact or [item for item in items if query.casefold() in ' '.join([item['id'], item['name'], item['description'], *item['keywords']]).casefold()]


def resolve_one(query):
    found = matches(query)
    if len(found) != 1:
        raise ValueError('需要唯一 ID；候选：' + json.dumps([{'id': x['id'], 'name': x['name']} for x in found], ensure_ascii=False))
    return found[0]


def extract(query, destination):
    item = resolve_one(query)
    if not item['package']:
        raise ValueError('此条目仅作页面参考，没有经登记的独立源码包。不要根据文件路径自动复制整个项目。')
    bundle = json.loads((ASSETS / item['package']).read_text(encoding='utf-8'))
    target = Path(destination).resolve()
    if target.exists():
        raise ValueError('输出目录必须不存在；先解包到新的临时目录，再由 Agent 审查接入，避免覆盖业务文件。')
    pending = []
    # Validate the entire manifest before writing anything.
    for file in bundle['files']:
        relative = Path(file['path'])
        if relative.is_absolute() or '..' in relative.parts or '\\' in file['path'] or ':' in file['path']:
            raise ValueError('不安全的源码路径')
        path = (target / relative).resolve()
        if target not in path.parents:
            raise ValueError('源码路径超出输出目录')
        content = file['content'].encode('utf-8')
        if hashlib.sha256(content).hexdigest() != item['fileHashes'].get(file['path']):
            raise ValueError('源码包内容校验失败：' + file['path'])
        pending.append((path, content))
    for path, content in pending:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
    (target / 'uim-provenance.json').write_text(json.dumps({
        'id': item['id'], 'snapshot': catalog()['snapshot'], 'fingerprint': item['fingerprint'],
        'dependencies': item['dependencies'], 'example': bundle['example'], 'exportName': bundle['exportName'],
    }, ensure_ascii=False, indent=2), encoding='utf-8')
    return {'directory': str(target), 'files': len(pending), 'dependencies': item['dependencies'], 'example': bundle['example']}


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = unquote(urlsplit(self.path).path)
        path = (ASSETS / 'site' / parsed.lstrip('/')).resolve()
        root = (ASSETS / 'site').resolve()
        if path != root and root not in path.parents:
            self.send_error(403)
            return
        if parsed == '/__uim_health':
            body = json.dumps({'snapshot': catalog()['snapshot']}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if not path.is_file() and not Path(parsed).suffix:
            self.path = '/index.html'
        super().do_GET()

    def list_directory(self, path):
        self.send_error(404)

    def log_message(self, *args):
        pass


def serve(port):
    handler = functools.partial(Handler, directory=str(ASSETS / 'site'))
    ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()


def browse(open_browser):
    version = catalog()['snapshot']
    for port in range(5187, 5197):
        base = f'http://127.0.0.1:{port}'
        try:
            with urlopen(base + '/__uim_health', timeout=.3) as response:
                if json.load(response).get('snapshot') == version:
                    if open_browser:
                        webbrowser.open(base + '/components')
                    return {'url': base + '/components', 'reused': True}
        except (OSError, ValueError):
            pass
        # A busy port is never killed. The child exits on bind failure; try another.
        options = {'creationflags': subprocess.CREATE_NO_WINDOW} if os.name == 'nt' else {'start_new_session': True}
        process = subprocess.Popen([sys.executable, str(Path(__file__).resolve()), 'serve', '--port', str(port)], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, **options)
        for _ in range(30):
            if process.poll() is not None:
                break
            try:
                with urlopen(base + '/__uim_health', timeout=.2) as response:
                    if json.load(response).get('snapshot') == version:
                        if open_browser:
                            webbrowser.open(base + '/components')
                        return {'url': base + '/components', 'reused': False, 'pid': process.pid}
            except (OSError, ValueError):
                pass
            time.sleep(.05)
        if process.poll() is None:
            process.terminate()
            process.wait(timeout=5)
    raise RuntimeError('5187–5196 端口不可用；未停止任何已有服务。')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    lookup = sub.add_parser('catalog')
    lookup.add_argument('query', nargs='?', default='')
    info = sub.add_parser('info')
    info.add_argument('query')
    unpack = sub.add_parser('extract')
    unpack.add_argument('query')
    unpack.add_argument('--out', required=True)
    start = sub.add_parser('browse')
    start.add_argument('--no-open', action='store_true')
    server = sub.add_parser('serve')
    server.add_argument('--port', type=int, required=True)
    args = parser.parse_args()
    if args.command == 'serve':
        serve(args.port)
        return
    if args.command == 'catalog':
        result = [{key: item[key] for key in ['id', 'name', 'category', 'description', 'keywords', 'variants', 'package']} for item in matches(args.query)]
    elif args.command == 'info':
        result = resolve_one(args.query)
    elif args.command == 'extract':
        result = extract(args.query, args.out)
    else:
        result = browse(not args.no_open)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, RuntimeError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
