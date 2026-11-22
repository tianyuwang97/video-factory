/* Eight purpose-built miniature workshops, authored as vector equipment. */
function workshopScene(kind) {
 const rail='<path d="M-78 5 0 43 80 4" fill="none" stroke="#fff" stroke-width="3"/>';
 const feet='<ellipse cx="2" cy="11" rx="79" ry="25" fill="#243764" opacity=".12"/>';
 const monitor=(x,y,w,h,inside)=>`<g transform="translate(${x} ${y})"><path d="M${w/2-3} ${h}v12m-13 0h26" stroke="#7e90ad" stroke-width="5" stroke-linecap="round"/><rect x="3" y="-3" width="${w}" height="${h}" rx="5" fill="#70849f"/><rect width="${w}" height="${h}" rx="5" fill="#263b55"/><rect x="4" y="4" width="${w-8}" height="${h-8}" rx="2" fill="#102738"/>${inside}<path d="M4 4H${w-4}" stroke="#9eacc6" stroke-width="1" opacity=".6"/></g>`;
 const scenes={
 idea:`
 <path d="M-75-7V-89L-14-119 35-94V-13L-26 17Z" fill="#edf1fc" stroke="#d4ddec" stroke-width="2"/>
 <path d="M-75-89-14-119 35-94-26-64Z" fill="#cbd7ee"/>
 <path d="M-69-84-28-64V-13L-69-33Z" fill="#dce7f4"/>
 <path d="M-65-72-34-57v9l-31-15Zm0 20 31 15v8l-31-15Z" fill="#b2c6df"/>
 <path d="M-14-100 26-81v48l-40-19Z" fill="#fff" stroke="#b8c8e2" stroke-width="2"/>
 <path d="m-6-84 24 12m-24-2 16 8m-16 2 24 12" stroke="#8da5c6" stroke-width="3"/>
 <path d="M-56 1 1-28 70 6 13 35Z" fill="#c3d3ec"/><path d="M-56 1v10l69 34V35Zm69 34 57-29v10L13 45Z" fill="#8fa9d1"/>
 <g transform="translate(21 -35) rotate(-24)"><path d="M0 14v42" stroke="#546c9e" stroke-width="12" stroke-linecap="round"/><circle cy="-14" r="29" fill="#daf2ff" fill-opacity=".85" stroke="#6a86bd" stroke-width="8"/><circle cy="-14" r="21" fill="url(#lens-glass)"/><path d="M-14-27q8-9 19-5" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="m-10-11 7 6 13-15" stroke="#7bb7b6" stroke-width="3" fill="none"/></g>
 <g transform="translate(-33 -116)"><circle r="17" fill="#ffdfa1"/><path d="M-9 11h18v10H-9Z" fill="#e8b459"/><path d="M-6 24H6M0-28v-7M-24-15l-7-4M24-15l7-4" stroke="#dcba75" stroke-width="3" stroke-linecap="round"/></g>
 <path d="m-48 10 16-8 19 9-16 8Z" fill="#fff"/><path d="m-42 10 9-4m-3 8 9-4" stroke="#a9bbd5" stroke-width="2"/>
 `,
 script:`
 <path d="M-77-16-24-43 71 4 18 31Z" fill="#cbd6ec"/><path d="M-77-16v20l95 47V31L71 4v20L18 51" fill="#8d9fc2"/>
 <path d="M-62-34-14-57 63-19 15 5Z" fill="#aabbdc"/><path d="M-62-34v22L15 25V5Zm77 39 48-24V3L15 25Z" fill="#7389b2"/>
 <path d="M-45-39v-67l51-24 41 21v69L-4-16Z" fill="#cad8ee"/>
 <path d="M-38-41v-67l44-21 33 17v68L-5-24Z" fill="#fcfdff" stroke="#e1e7f3" stroke-width="2"/>
 <path d="m-26-91 45 22m-45-12 45 22m-45-12 34 17m-34-7 43 21" stroke="#93a6c9" stroke-width="3" stroke-linecap="round"/>
 <path d="m-53-47 69 34 42-20" fill="none" stroke="#4c658e" stroke-width="10" stroke-linecap="round"/>
 <g fill="#f4f7ff" stroke="#becbe0" stroke-width="1">${Array.from({length:4},(_,j)=>Array.from({length:7},(_,i)=>`<path d="m${-48+i*10+j*5} ${-30+i*4.9-j*2.5} 6-3 7 3.5-6 3Z"/>`).join('')).join('')}</g>
 <path d="m-25 4 32 16 13-6-32-16Z" fill="#e9eef9"/>
 <g transform="translate(52 -67) rotate(24)"><path d="M0-40h10v59L5 32 0 19Z" fill="#e9bb70"/><path d="M0-40h10v10H0Z" fill="#d7a2a0"/><path d="m0 19 5 13 5-13" fill="#f9e5c8"/><path d="m3 27 2 5 2-5" fill="#53657f"/></g>
 <path d="m-64-3 19 9m-9-8 19 9" stroke="#59759f" stroke-width="3"/>
 `,
 storyboard:`
 <path d="M-77-21v-91L26-63v91Z" fill="#c3dced" stroke="#a3c2d8" stroke-width="2"/>
 ${Array.from({length:6},(_,i)=>{let c=i%3,r=Math.floor(i/3),x=-69+c*32,y=-99+c*15+r*34;return `<g><path d="m${x} ${y} 27 13v25l-27-13Z" fill="#fff"/><path d="m${x+3} ${y+18} 7-5 7 9 6-2 4 5-24-12Z" fill="${['#a5c6c2','#b3b4df','#e1c18c'][c]}"/><circle cx="${x+19}" cy="${y+15}" r="2.5" fill="#efcf8e"/></g>`;}).join('')}
 <path d="M-65-16v28M14 22v21" stroke="#819eb8" stroke-width="5"/>
 <g transform="translate(48 -35)"><path d="M0 19-20 57M0 19l22 38M0 19v40" stroke="#748da6" stroke-width="4" stroke-linecap="round"/><path d="m-22-20 36-4 15 9v33l-36 5-15-9Z" fill="#678cac"/><path d="m-22-20 15 9 36-4-15-9Z" fill="#a6c4dc"/><path d="M14-3 34-13v27L14 5Z" fill="#355777"/><circle cx="-8" cy="1" r="7" fill="#b1d8df"/></g>
 <g transform="translate(-35 2) rotate(16)"><rect x="-19" y="-17" width="43" height="30" rx="3" fill="#344f69"/><path d="M-19-20H24V-10H-19Z" fill="#f6f8fc"/><path d="m-17-20 9 10m5-10 9 10m5-10 9 10" stroke="#465f76" stroke-width="5"/><path d="M-11 0H17M-11 6H7" stroke="#92b5c9" stroke-width="2"/></g>
 `,
 voice:`
 <path d="M-77-11v-92l59-30 56 28v91l-56 28Z" fill="#d6cdeb"/>
 <path d="M-77-103-18-133v99l-59 29Z" fill="#9683bb"/><path d="M-18-133 38-105v91l-56-20Z" fill="#b09cca"/>
 ${Array.from({length:5},(_,i)=>`<path d="m${-70+i*10} ${-99-i*5}v68" stroke="#6e609c" stroke-width="5" opacity=".65"/>`).join('')}
 <path d="M-10-116 29-97v51l-39-19Z" fill="#35475f" stroke="#e6e0f0" stroke-width="4"/><path d="m-5-108 25 12-25 22" fill="#fff" opacity=".09"/>
 <g class="audio-meter" stroke="#a3e0d1" stroke-width="2.5" stroke-linecap="round"><path d="M-4-89v8"/><path d="M3-94v25"/><path d="M10-87v17"/><path d="M17-85v24"/><path d="M24-75v12"/></g>
 <g transform="translate(-37 -52)"><ellipse cy="59" rx="19" ry="8" fill="#71809f"/><path d="M0 7v49" stroke="#485777" stroke-width="4"/><rect x="-9" y="-37" width="18" height="36" rx="9" fill="#e5e9f0" stroke="#62748e" stroke-width="2"/><path d="M-5-29H5M-5-24H5M-5-19H5M-5-14H5" stroke="#9aacc1" stroke-width="2"/><path d="M-15-18v10a15 15 0 0 0 30 0v-10" fill="none" stroke="#546b8d" stroke-width="4"/><circle cx="18" cy="-16" r="14" fill="#273f5b" fill-opacity=".8" stroke="#657d98" stroke-width="3"/><path d="M18-2 5 25" stroke="#5c7392" stroke-width="2"/></g>
 <path d="m0 1 48-24 43 21-48 24Z" fill="#9a91bc"/><path d="M0 1v17l43 22V22L91-2v18L43 40" fill="#756b9d"/>
 <path d="m7 0 39-19 36 18-39 19Z" fill="#33415e"/>
 ${Array.from({length:6},(_,i)=>`<path d="m${15+i*7} ${i*3.4} 24-12" stroke="#8391aa" stroke-width="2"/><path d="m${23+i*7} ${i*3.4-4} 5 2" stroke="${i%2?'#f1c18a':'#91dfce'}" stroke-width="3"/>`).join('')}
 <g transform="translate(55 -51)"><path d="M-15 4V-31a17 17 0 0 1 34 0V4" fill="none" stroke="#5c5b87" stroke-width="7"/><rect x="-21" y="-12" width="12" height="26" rx="5" fill="#4a506d"/><rect x="13" y="-12" width="12" height="26" rx="5" fill="#4a506d"/><path d="M24 9q16 21-7 35" fill="none" stroke="#77749f" stroke-width="2"/></g>
 <path d="M-12-143H18" stroke="#ecb9ac" stroke-width="5" stroke-linecap="round"/>
 `,
 keyframes:`
 <path d="M-68-12v-92l67-28 60 31v87Z" fill="#d3e9e0"/><path d="M-68-104-1-132v99l-67 30Z" fill="#a8cfc1"/><path d="M-1-132 59-101v87L-1-33Z" fill="#e4f1e9"/>
 <path d="M-45-88-4-107 37-87v65L-4-2-45-23Z" fill="#f7fcf8" stroke="#86afa0" stroke-width="3"/>
 <path d="m-38-29 18-25 14 11 15-24 20 40-33 16Z" fill="#8ab6a7"/><circle cx="17" cy="-77" r="8" fill="#edc775"/>
 <path d="M-34 7-44 31M25 8 35 31" stroke="#789c92" stroke-width="4"/>
 <g transform="translate(-67 -46)"><path d="M0-15V46m0-13-14 17m14-17 14 17" stroke="#648583" stroke-width="3"/><path d="M-18-49 4-59 21-43 16-18-8-13-23-29Z" fill="#f6fff8" stroke="#8fafa6" stroke-width="4"/><path d="m-16-44 17-7 13 11-4 17-16 4-13-10Z" fill="#fff6d8"/></g>
 <g transform="translate(69 -27)"><path d="M0-15V45m0-12-13 16m13-16 13 16" stroke="#648583" stroke-width="3"/><path d="M-18-49 4-59 21-43 16-18-8-13-23-29Z" fill="#f6fff8" stroke="#8fafa6" stroke-width="4"/><path d="m-16-44 17-7 13 11-4 17-16 4-13-10Z" fill="#fff6d8"/></g>
 <path d="m-23 23 27-13 34 17-27 13Z" fill="#e9f6f2" stroke="#b0d1c4" stroke-width="2"/><path d="m-17 18 27-13 34 17-27 13Z" fill="#fff" stroke="#b0d1c4" stroke-width="2"/><path d="m-7 16 10-4 15 8-10 4Z" fill="#89b9a4"/>
 `,
 video:`
 <path d="M-78-21-27-46 41-12-10 13Z" fill="#c6d5ef"/><path d="M-78-21v23l68 34V13L41-12v23L-10 36" fill="#7d96c4"/>
 <g transform="translate(-53 -35)"><path d="M-24-17v-66l40 19v66Z" fill="#344d76"/><path d="m16-64 21-10v65L16 2Z" fill="#526f9e"/><path d="m-24-83 21-10 40 19-21 10Z" fill="#91add2"/>
 ${Array.from({length:4},(_,i)=>`<path d="m-18 ${-72+i*14} 27 13v9l-27-13Z" fill="#47638b"/><circle cx="-13" cy="${-65+i*14}" r="2" fill="#99e2cf"/><path d="m-6 ${-62+i*14} 10 5" stroke="#9cb6d7" stroke-width="2"/>`).join('')}</g>
 <path d="M-6-11 28-28 76-4 42 13Z" fill="#6e88b3"/><path d="M-6-11v16l48 24V13L76-4v16L42 29" fill="#536c96"/>
 <g transform="translate(35 -23)"><ellipse cy="9" rx="18" ry="9" fill="#a0b5d8"/><path d="M0 5v-29l-28-24 11-29" fill="none" stroke="#adc4e7" stroke-width="15" stroke-linejoin="round"/><path d="M0 5v-29l-28-24 11-29" fill="none" stroke="#e6efff" stroke-width="5" stroke-linejoin="round"/><circle cy="-24" r="9" fill="#6585b8"/><circle cx="-28" cy="-48" r="9" fill="#6585b8"/><path d="m-17-77 18-7 11 12m-11-12-4-13" fill="none" stroke="#526f9c" stroke-width="5" stroke-linecap="round"/></g>
 <g transform="translate(42 -117)"><rect x="-17" y="-15" width="43" height="33" rx="4" fill="#c9d9f2"/><rect x="-24" y="-9" width="43" height="33" rx="4" fill="#e8f0fd" stroke="#95acd5" stroke-width="2"/><path d="m-10-1 15 9-15 9Z" fill="#7e9ed5"/></g>
 <path d="m-65 8 43 21" stroke="#d5e2f6" stroke-width="3" stroke-dasharray="5 5"/>
 `,
 edit:`
 <path d="M-82-8-26-36 79 16 23 44Z" fill="#d9c9b6"/><path d="M-82-8V4L23 56V44L79 16v12L23 56" fill="#a28b77"/>
 <path d="M-70 10v24M16 52v23M67 34v23" stroke="#7f899d" stroke-width="6"/>
 ${monitor(-78,-110,94,58,'<rect x="9" y="9" width="43" height="26" rx="2" fill="#365c6b"/><path d="m16 30 10-13 10 9 8-5 5 9Z" fill="#8ab6ad"/><circle cx="43" cy="15" r="3" fill="#e4c88e"/><path d="M59 12H83M59 19H76M59 26H80" stroke="#7890ac" stroke-width="3"/><path d="M9 42H83M9 49H66" stroke="#a397bc" stroke-width="4"/>')}
 ${monitor(23,-67,61,46,'<path d="M8 12H50M8 20H40M8 28H52M8 36H45" stroke="#6f91aa" stroke-width="4"/><path d="M17 12H39M25 20H42" stroke="#d5b483" stroke-width="4"/><path d="M29 28H49M12 36H34" stroke="#9ebdb3" stroke-width="4"/><path d="M30 7v33" stroke="#f2b0a0" stroke-width="2"/>')}
 <path d="m-61-10 23-12 53 27-23 12Z" fill="#edf0f4" stroke="#b7b6b6" stroke-width="1.5"/>
 <path d="m-53-10 42 21m-35-25 42 21m-35-25 42 21" stroke="#b2bac8" stroke-width="2" stroke-dasharray="3 3"/>
 <ellipse cx="33" cy="24" rx="10" ry="5" fill="#d4dbe4" transform="rotate(26 33 24)"/>
 <g transform="translate(-57 29)"><circle r="18" fill="#7889a4"/><circle r="6" fill="#c5d1df"/>${[0,72,144,216,288].map(a=>`<circle cx="${Math.cos(a*Math.PI/180)*11}" cy="${Math.sin(a*Math.PI/180)*11}" r="4" fill="#dce4ef"/>`).join('')}<path d="M17 0q27-3 25 23" fill="none" stroke="#7185a1" stroke-width="6"/></g>
 `,
 qa:`
 <path d="M-86-5 3-49 89-6 0 38Z" fill="#b4c5c0"/><path d="M-86-5v13L0 51V38L89-6V7L0 51" fill="#7f9b94"/>
 <path d="M-77-5 3-44 80-6 0 33Z" fill="#546f72"/>
 ${Array.from({length:8},(_,i)=>`<path d="m${-68+i*10} ${-6-i*4.8} 67 33" stroke="#95b3ac" stroke-width="5" stroke-linecap="round"/>`).join('')}
 <path d="M-52-9v-73L-1-107 44-85V-11l-13 7v-70l-32-16-37 19v69Z" fill="#a2bf95"/>
 <path d="m-52-82 13-7 51-26 45 22-13 8-45-22Z" fill="#d1e2c0"/>
 <path d="M44-85 57-93v75l-13 7Z" fill="#74986e"/>
 <path class="scanner-glow" d="M-35-63 27-32v35l-62-31Z" fill="#9de9d3" fill-opacity=".32" stroke="#a7edda" stroke-width="1"/>
 <g transform="translate(-1 -99)"><circle r="20" fill="#f7fff0" stroke="#739a70" stroke-width="4"/><path d="m-10 0 7 7 13-15" stroke="#79a473" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
 <g transform="translate(19 8)"><path d="m-20-11 21-10 24 12-21 11Z" fill="#efd4a5"/><path d="M-20-11V9L4 21V2L25-9v20L4 21" fill="#c6a16e"/><path d="m-10-16 24 12v9l-8 4V0l-24-12" fill="#f9e8c8"/><path d="m9 8 3 4 7-8" fill="none" stroke="#f7ffef" stroke-width="2"/></g>
 <g transform="translate(66 30)"><path d="M-13-7 2-14 20-5 5 3Z" fill="#efe0c3"/><path d="M-13-7v16L5 18V3L20-5v16L5 18" fill="#cbb288"/><path d="m-4-11 17 9" stroke="#fff2db" stroke-width="5"/></g>
 <path d="M-65 15v21M61 29v21" stroke="#7d958e" stroke-width="5"/>
 `
 };
 let art=scenes[kind]||'';
 const materials={'#cbd6ec':'ice-metal','#d6cdeb':'lilac-metal','#d9c9b6':'sand-metal','#a2bf95':'sage-metal','#102738':'screen-glass','#edf1fc':'ice-metal','#d3e9e0':'mint-metal'};
 for(const [color,id] of Object.entries(materials))art=art.split(`fill="${color}"`).join(`fill="url(#${id})"`);
 return feet+art+rail;
}
function workshopDefinitions(){
 const colors={'ice-metal':['#f5f8ff','#c0d0e7'],'lilac-metal':['#e7e0f4','#a493c3'],'sand-metal':['#eee3d5','#b49c84'],'sage-metal':['#cadfbc','#88a87d'],'mint-metal':['#edf9f1','#a7cfc0'],'screen-glass':['#102738','#2b485c']};
 return '<defs>'+Object.entries(colors).map(([id,c])=>`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`).join('')+'</defs>';
}
