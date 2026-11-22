import sys,os,json,time,datetime,importlib.util,mimetypes
from pathlib import Path
import requests
sys.dont_write_bytecode=True
ROOT=Path(__file__).parent
cfg=json.loads(sys.stdin.readline());base=cfg['url'].rstrip('/')
if not base.startswith('https://'):raise RuntimeError('HTTPS required')
session=requests.Session()
if cfg.get('token'):session.headers['OAI-Sites-Authorization']='Bearer '+cfg['token']
session.headers['X-Factory-Sync-Key']=cfg['sync_token']
cfg.clear()
spec=importlib.util.spec_from_file_location('factory',str(ROOT/'factory_state.py'))
factory=importlib.util.module_from_spec(spec);spec.loader.exec_module(factory)
cachepath=ROOT/'sync-cache.json'
try: cache=json.loads(cachepath.read_text(encoding='utf-8'))
except:cache={}
def report(**values):
 values.update(pid=os.getpid(),updated_at=datetime.datetime.now().astimezone().isoformat())
 (ROOT/'sync-status.json').write_text(json.dumps(values,ensure_ascii=False,indent=2),encoding='utf-8')
def clean_json(value):
 if isinstance(value,dict):
  return {k:clean_json(v) for k,v in value.items() if not any(x in k.lower() for x in ['path','prompt','directory','audio_source','root','sha256']) and not(isinstance(v,str) and (':/' in v or ':\\' in v))}
 if isinstance(value,list):return [clean_json(v) for v in value]
 return value
while True:
 try:
  states=[];uploads=0
  for project in factory.projects():
   state,assets=factory.project_state(project);state.pop('projects',None);state['assets']={}
   # Make progress available before large media uploads finish.
   for role,path in assets.items():
    if role not in ('cover','portrait','landscape','narration','storyboard','keyframe','shot-video','qa'):continue
    stat=path.stat();key=project['id']+'/'+role;stamp=[stat.st_size,stat.st_mtime_ns]
    if stat.st_size>100000000:continue
    if cache.get(key)!=stamp:
     report(status='uploading',project=state['title'],asset=role,bytes=stat.st_size,uploaded=uploads)
     mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
     if role in ('qa','storyboard'):
      body=json.dumps(clean_json(json.loads(path.read_text(encoding='utf-8-sig'))),ensure_ascii=False).encode()
      r=session.put(base+'/api/assets/'+key,data=body,headers={'Content-Type':'application/json'},timeout=180,allow_redirects=False)
     else:
      with path.open('rb') as f:r=session.put(base+'/api/assets/'+key,data=f,headers={'Content-Type':mime},timeout=300,allow_redirects=False)
     if r.status_code!=200:raise RuntimeError('Asset upload HTTP '+str(r.status_code))
     cache[key]=stamp;cachepath.write_text(json.dumps(cache),encoding='utf-8');uploads+=1
    state['assets'][role]='/asset/'+key
   states.append(state)
  r=session.post(base+'/api/sync',json={'projects':states},timeout=30,allow_redirects=False)
  if r.status_code!=200:raise RuntimeError('State sync HTTP '+str(r.status_code))
  report(status='synced',projects=len(states),uploaded=uploads,synced_at=r.json()['synced_at'])
 except Exception as e:
  # Do not log request headers or credentials.
  report(status='retrying',error_type=type(e).__name__,detail=str(e) if isinstance(e,RuntimeError) else 'Connection or local file error')
 time.sleep(15)
