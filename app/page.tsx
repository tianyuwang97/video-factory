"use client";
import { useEffect, useState } from "react";
export default function Home(){const[src,setSrc]=useState("/factory/index.html");useEffect(()=>setSrc("/factory/index.html"+window.location.search),[]);return <iframe title="稍微一等 · 视频工厂" src={src} style={{position:"fixed",inset:0,width:"100%",height:"100%",border:0}}/>;}