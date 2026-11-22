"""Local, read-only video production dashboard. No external API dependencies."""
from pathlib import Path
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, quote
import argparse, datetime, json, mimetypes, re, time

ROOT = Path(__file__).resolve().parent
STAGE_IDS = ['idea','script','storyboard','voice','keyframes','video','edit','qa']

def read_json(path, fallback=None):
    for _ in range(2):
        try:
            return json.loads(Path(path).read_text('utf-8-sig'))
        except (OSError, ValueError):
            time.sleep(.02)
    return fallback

def projects():
    return read_json(ROOT/'projects.json', {'projects':[]})['projects']

def status(done, total, note, active=False):
    return {'status':'done' if done >= total and total else 'running' if done or active else 'pending',
            'done':done, 'total':total, 'note':note}

def project_state(config):
    work, out = Path(config['work']), Path(config['outputs'])
    artifacts = {}
    stages = {s: status(0,1,'尚未开始') for s in STAGE_IDS}
    activity = []
    metrics = {'shots':None,'clips':None,'exports':0}
    duration_label = '待生成'
    if config.get('adapter') == 'scene-recast':
        plan = read_json(work/'restored-storyboard.json', [])
        manifest = read_json(work/'production-manifest.json', {})
        qa = read_json(out/'quality-report.json', {})
        human_count = sum(r.get('source') == 'cartoon_recast' for r in plan)
        expected = human_count*2
        keys = sum((work/'keyframes'/f'{a}-{r["id"]:03d}.png').is_file()
                   for a in ['vertical','landscape'] for r in plan if r.get('source') == 'cartoon_recast')
        clips = len(list((work/'video-jobs').glob('*/result.json')))
        source_audio = work/'audio/narration.wav'
        candidates = {
            'cover':out/'cover-landscape.png',
            'portrait':out/'粉丝数量是另一种货币-场景还原-竖版.mp4',
            'landscape':out/'粉丝数量是另一种货币-场景还原-横版.mp4',
            'narration':source_audio,
            'storyboard':work/'restored-storyboard.json',
            'keyframe':work/'keyframes/vertical-001.png',
            'shot-video':work/'raw/vertical-001.mp4',
            'qa':out/'quality-report.json'
        }
        for k,path in candidates.items():
            if path.is_file():
                if k in ('portrait','landscape'):
                    aspect = 'vertical' if k == 'portrait' else 'landscape'
                    if not (work/f'{aspect}-final-ready.json').is_file():
                        continue
                artifacts[k] = path
        exports = sum(k in artifacts for k in ('portrait','landscape'))
        stages['idea'] = status(bool(plan),1,'沿用已确认的粉丝与货币选题')
        stages['script'] = status(source_audio.is_file(),1,'沿用已确认口播，保留开场与结尾提问')
        stages['storyboard'] = status(bool(plan),1,f'{len(plan)} 个有效分镜 · 横竖独立构图')
        stages['voice'] = status(source_audio.is_file(),1,'使用已确认的小等配音 · 不加 BGM')
        stages['keyframes'] = status(keys,expected,f'{keys} / {expected} 张人物关键帧已准备')
        stages['video'] = status(clips,expected,f'{clips} / {expected} 段本地人物动画已完成')
        stages['edit'] = status(exports,2,f'{exports} / 2 版成片已导出')
        verified = qa.get('status') == 'complete' and exports == 2
        stages['qa'] = status(verified,1,'音画、帧数与画面检查通过' if verified else '等待完成成片验收')
        metrics = {'shots':len(plan),'clips':clips,'exports':exports}
        duration = manifest.get('duration_seconds',0)
        if duration:
            duration_label = f'{int(round(duration))//60}:{int(round(duration))%60:02d}'
        if verified:
            activity.append('横竖版验收完成，原声音轨保持一致')
        if exports:
            activity.append(f'{exports} 版成片已导出并保留制作记录')
        if clips:
            activity.append(f'{clips} 段卡通人物动画已完成')
    # Any new project can supply explicit stage state without pretending to infer untracked work.
    manual = read_json(work/'workflow-state.json', {})
    allowed_assets = {'cover','portrait','landscape','narration','storyboard','keyframe','shot-video','qa'}
    for key, name in config.get('assets', {}).items():
        if key not in allowed_assets or not isinstance(name,str):
            continue
        candidate = Path(name).resolve()
        if candidate.is_file() and any(candidate.is_relative_to(root.resolve()) for root in (work,out)):
            artifacts[key] = candidate
    for key, value in manual.get('stages', {}).items():
        if key in STAGE_IDS and isinstance(value,dict):
            stages[key].update(value)
    metrics.update(manual.get('metrics',{}))
    if 'exports' not in manual.get('metrics',{}):
        metrics['exports'] = sum(k in artifacts for k in ('portrait','landscape'))
    if manual.get('activity'):
        activity = manual['activity'][:3]
    payload = {'id':config['id'],'title':config['title'],'subtitle':config.get('subtitle','视频制作项目'),
        'stages':stages,'metrics':metrics,'activity':activity or ['等待项目开始写入制作记录'],
        'duration_label':manual.get('duration_label',duration_label),'synced_at':datetime.datetime.now().astimezone().isoformat(),
        'assets':{k:f'/asset/{quote(config["id"])}/{k}' for k in artifacts},
        'projects':[{'id':p['id'],'title':p['title']} for p in projects()]}
    return payload, artifacts

class Handler(BaseHTTPRequestHandler):
    server_version = 'VideoFactory/1.0'
    def log_message(self, fmt, *args):
        print(self.log_date_time_string(),fmt % args,flush=True)

    def json_response(self, data, code=200):
        body=json.dumps(data,ensure_ascii=False).encode('utf-8')
        self.send_response(code);self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','no-store')
        self.end_headers()
        if self.command != 'HEAD': self.wfile.write(body)

    def do_HEAD(self): self.do_GET()
    def do_GET(self):
        try:
            self.route()
        except (BrokenPipeError,ConnectionResetError,ConnectionAbortedError):
            pass
        except Exception as error:
            print(type(error).__name__,str(error),flush=True)
            self.send_error(500,'Local project unavailable')

    def route(self):
        url=urlparse(self.path)
        if url.path == '/api/state':
            config_list=projects()
            identifier=parse_qs(url.query).get('project',[config_list[0]['id'] if config_list else ''])[0]
            config=next((p for p in config_list if p['id']==identifier),None)
            if not config: return self.json_response({'error':'Unknown project'},404)
            return self.json_response(project_state(config)[0])
        match=re.fullmatch(r'/asset/([a-zA-Z0-9_-]+)/([a-zA-Z0-9_-]+)',url.path)
        if match:
            config=next((p for p in projects() if p['id']==match[1]),None)
            if config:
                path=project_state(config)[1].get(match[2])
                if path: return self.send_file(path)
            return self.send_error(404)
        # Serve only known application assets. Never expose arbitrary files on D:.
        assets={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/app.js':'app.js','/equipment.js':'equipment.js'}
        if url.path in assets: return self.send_file(ROOT/'dist'/assets[url.path])
        if url.path == '/favicon.ico':
            self.send_response(204);self.end_headers();return
        self.send_error(404)

    def send_file(self,path):
        size=path.stat().st_size;start=0;end=size-1;code=200
        header=self.headers.get('Range')
        if header:
            match=re.fullmatch(r'bytes=(\d*)-(\d*)',header)
            if not match or not any(match.groups()):
                self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return
            if match[1]: start=int(match[1]);end=min(int(match[2]) if match[2] else size-1,size-1)
            else: start=max(0,size-int(match[2]))
            if start>=size or end<start:
                self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return
            code=206
        mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
        self.send_response(code);self.send_header('Content-Type',mime)
        self.send_header('Content-Length',str(end-start+1));self.send_header('Accept-Ranges','bytes')
        self.send_header('Cache-Control','no-cache');self.send_header('X-Content-Type-Options','nosniff')
        if code==206:self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        self.end_headers()
        if self.command=='HEAD': return
        with path.open('rb') as stream:
            stream.seek(start);remaining=end-start+1
            while remaining:
                block=stream.read(min(256*1024,remaining))
                if not block:break
                self.wfile.write(block);remaining-=len(block)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8787);args=parser.parse_args()
    print(f'Video Factory: http://127.0.0.1:{args.port}',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
