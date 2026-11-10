'use strict';
// A400M Online v0.4.3: versioned chat-free assets to defeat stale browser caches.
// Keep models/audio cacheable so the fix does not waste mobile data.
const fs=require('node:fs');
const path=require('node:path');
const root='game',pub=path.join(root,'public');
const jsOld=path.join(pub,'multiplayer.js'),cssOld=path.join(pub,'multiplayer.css');
const js=fs.readFileSync(jsOld,'utf8');
if(/mpChat|chatMsgs|showIncoming|mpChatInput|mpChatLog|renderChat/.test(js))
 throw Error('Unexpected legacy chat code in client; cannot safely deploy.');
if(!js.includes("leaveButton.style.display='block'"))
 throw Error('Flight exit button missing');
const serverPath=path.join(root,'server.js');
let server=fs.readFileSync(serverPath,'utf8');
if(server.includes("msg.type==='chat'"))throw Error('Chat still enabled on server');
const oldCache="ext==='.html'?'no-cache':'public, max-age=86400'";
if(!server.includes(oldCache))throw Error('Unexpected Cache-Control logic');
server=server.replace(oldCache,"['.html','.js','.css'].includes(ext)?'no-store, max-age=0, must-revalidate':'public, max-age=86400'");
fs.writeFileSync(serverPath,server);
const htmlPath=path.join(pub,'index.html');
let html=fs.readFileSync(htmlPath,'utf8');
if(!html.includes('href="multiplayer.css"')||!html.includes('src="multiplayer.js"'))
 throw Error('Expected original multiplayer stylesheet/script references');
html=html.replace('href="multiplayer.css"','href="multiplayer-v043.css"')
         .replace('src="multiplayer.js"','src="multiplayer-v043.js"');
html=html.replace('</head>','<meta name="a400m-online-version" content="v0.4.3-no-chat">\n<style>#mpChat,.mpChat,#mpChatLog,.mpChatLog{display:none!important;visibility:hidden!important}</style>\n</head>');
fs.writeFileSync(htmlPath,html);
fs.renameSync(jsOld,path.join(pub,'multiplayer-v043.js'));
fs.renameSync(cssOld,path.join(pub,'multiplayer-v043.css'));
console.log('A400M Online v0.4.3: fresh chat-free JS/CSS; no-store on HTML/JS/CSS; 3D data stays cacheable');
