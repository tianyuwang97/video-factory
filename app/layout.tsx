import type { Metadata } from "next";
export const metadata:Metadata={
 title:"稍微一等 · 视频工厂",
 description:"一座小工厂，看清每一步。查看视频制作进度、工序与横竖版成片。",
 metadataBase:new URL("https://xiaodeng-video-factory.xiaoboss.chatgpt.site"),
 icons:{icon:[{url:"/brand/factory-icon-32-v1.png",sizes:"32x32",type:"image/png"},{url:"/favicon.ico",sizes:"48x48"}],apple:[{url:"/brand/factory-icon-180-v1.png",sizes:"180x180"}]},
 openGraph:{title:"稍微一等 · 视频工厂",description:"一座小工厂，看清每一步。",type:"website",images:[{url:"/brand/factory-icon-512-v1.png",width:512,height:512,alt:"稍微一等视频工厂 Logo"}]},
 twitter:{card:"summary",title:"稍微一等 · 视频工厂",images:["/brand/factory-icon-512-v1.png"]}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body style={{margin:0}}>{children}</body></html>;}
