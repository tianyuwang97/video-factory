import seed from "./factory-seed.json";
const roles = new Set(["cover","portrait","landscape","narration","storyboard","keyframe","shot-video","qa"]);
const valid = (id:string)=>/^[a-zA-Z0-9_-]{1,100}$/.test(id);
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export async function factoryApi(request:Request,env:Cloudflare.Env):Promise<Response|null>{
 const url=new URL(request.url),bucket=env.BUCKET;
 const syncToken=(env as Cloudflare.Env & {FACTORY_SYNC_TOKEN?:string}).FACTORY_SYNC_TOKEN;
 const writeRequest=(url.pathname==="/api/sync" && request.method==="POST")||(url.pathname.startsWith("/api/assets/") && request.method==="PUT");
 if(writeRequest){
  const supplied=request.headers.get("X-Factory-Sync-Key");
  if(!syncToken||!supplied)return json({error:"Unauthorized"},401);
  const encode=new TextEncoder();
  const [expected,actual]=await Promise.all([crypto.subtle.digest("SHA-256",encode.encode(syncToken)),crypto.subtle.digest("SHA-256",encode.encode(supplied))]);
  const a=new Uint8Array(expected),b=new Uint8Array(actual);let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
  if(diff!==0)return json({error:"Unauthorized"},401);
 }

 if(url.pathname==="/api/state" && request.method==="GET"){
  const stored=bucket?await bucket.get("factory/snapshot.json"):null;
  const snap:any=stored?await stored.json():seed;
  const p=snap.projects.find((x:any)=>x.id===(url.searchParams.get("project")||snap.projects[0]?.id));
  return p?json({...p,synced_at:snap.synced_at,sync_online:!!stored&&Date.now()-Date.parse(snap.synced_at)<90000,projects:snap.projects.map((x:any)=>({id:x.id,title:x.title}))}):json({error:"Unknown project"},404);
 }
 if(url.pathname==="/api/sync" && request.method==="POST"){
  if(!bucket)return json({error:"Storage unavailable"},503);
  const raw=await request.text();if(raw.length>2000000)return json({error:"Too large"},413);
  let data:any;try{data=JSON.parse(raw)}catch{return json({error:"Invalid JSON"},400)}
  if(!Array.isArray(data.projects)||data.projects.length>100||data.projects.some((p:any)=>!valid(p.id)||typeof p.title!=="string"||!p.stages))return json({error:"Invalid projects"},400);
  const clean={synced_at:new Date().toISOString(),projects:data.projects.map((p:any)=>({id:p.id,title:p.title.slice(0,300),subtitle:String(p.subtitle||"").slice(0,500),stages:p.stages,metrics:p.metrics||{},activity:p.activity||[],duration_label:p.duration_label||"",assets:Object.fromEntries(Object.keys(p.assets||{}).filter(r=>roles.has(r)).map(r=>[r,"/asset/"+p.id+"/"+r]))}))};
  await bucket.put("factory/snapshot.json",JSON.stringify(clean),{httpMetadata:{contentType:"application/json"}});
  return json({ok:true,synced_at:clean.synced_at});
 }
 const up=url.pathname.match(/^\/api\/assets\/([\w-]+)\/([\w-]+)$/);
 if(up && request.method==="PUT"){
  if(!bucket)return json({error:"Storage unavailable"},503);
  if(!valid(up[1])||!roles.has(up[2]))return json({error:"Unknown asset"},404);
  const size=Number(request.headers.get("Content-Length"));
  if(!size||size>100000000)return json({error:"Invalid size"},413);
  const mime=request.headers.get("Content-Type")||"application/octet-stream";
  if(!["image/png","image/jpeg","image/webp","video/mp4","audio/wav","audio/x-wav","audio/mpeg","application/json"].includes(mime))return json({error:"Unsupported type"},415);
  await bucket.put("factory/assets/"+up[1]+"/"+up[2],request.body,{httpMetadata:{contentType:mime}});
  return json({ok:true});
 }
 const asset=url.pathname.match(/^\/asset\/([\w-]+)\/([\w-]+)$/);
 if(asset && ["GET","HEAD"].includes(request.method)){
  if(!bucket||!valid(asset[1])||!roles.has(asset[2]))return json({error:"Not found"},404);
  const key="factory/assets/"+asset[1]+"/"+asset[2];
  const meta=await bucket.head(key);if(!meta)return json({error:"Not found"},404);
  const headers=new Headers({"Accept-Ranges":"bytes","Cache-Control":"private, max-age=30","X-Content-Type-Options":"nosniff"});
  meta.writeHttpMetadata(headers);headers.set("ETag",meta.httpEtag);
  let start=0,end=meta.size-1,status=200;
  const range=request.headers.get("Range");
  if(range){
   const m=range.match(/^bytes=(\d*)-(\d*)$/);
   if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{"Content-Range":"bytes */"+meta.size}});
   start=m[1]?Number(m[1]):Math.max(0,meta.size-Number(m[2]));
   end=m[1]&&m[2]?Math.min(Number(m[2]),end):end;
   if(start>end||start>=meta.size)return new Response(null,{status:416,headers:{"Content-Range":"bytes */"+meta.size}});
   status=206;headers.set("Content-Range",`bytes ${start}-${end}/${meta.size}`);
  }
  headers.set("Content-Length",String(end-start+1));
  if(request.method==="HEAD")return new Response(null,{status,headers});
  const body=await bucket.get(key,status===206?{range:{offset:start,length:end-start+1}}:undefined);
  return new Response(body?.body,{status,headers});
 }
 return null;
}