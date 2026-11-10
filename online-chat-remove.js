'use strict';
// A400M Online v0.4.2 — remove direct chat UI, chat messages and server protocol.
const fs=require('node:fs');
function modify(path,fn){let old=fs.readFileSync(path,'utf8');let out=fn(old);if(out===old)throw Error('No changes in '+path);fs.writeFileSync(path,out);}
function once(s,a,b){if(!s.includes(a))throw Error('Expected text not found: '+a.slice(0,85));return s.replace(a,b);}
modify('game/public/multiplayer.js',s=>{
 s=once(s,'serverReady=false,chatMsgs=[],audioStarted','serverReady=false,audioStarted');
 const chatLine=s.split('\n').find(x=>x.startsWith("const chat=document.createElement('div');"));
 if(!chatLine)throw Error('Chat element missing');
 const leave="const leaveButton=document.createElement('button');leaveButton.id='mpLeaveFlight';leaveButton.className='mpLeaveFlight';leaveButton.dataset.op='leave';leaveButton.textContent='退出';leaveButton.style.display='none';document.body.appendChild(leaveButton);";
 s=once(s,chatLine,leave);
 s=s.replace(/function showIncoming\(name,message\)\{.*?\}function maybeNotify\(/,'function maybeNotify(');
 if(s.includes('function showIncoming'))throw Error('Incoming chat toast still found');
 s=once(s,'。チャットは送信したときだけ通信するよ。','。');
 s=s.replaceAll("chat.style.display='none'","leaveButton.style.display='none'");
 s=s.replaceAll("chat.style.display='block'","leaveButton.style.display='block'");
 const incoming=s.split('\n').find(x=>x.trim().startsWith("case 'chat':"));
 if(!incoming)throw Error('Chat inbound case not found');
 s=once(s,incoming,'');
 const lbl=s.split('\n').find(x=>x.trim().startsWith("$('mpRoomLabel').textContent="));
 if(!lbl)throw Error('Chat label not found');
 s=once(s,lbl,'');
 const renderer=s.split('\n').find(x=>x.startsWith('function renderChat(){'));
 if(!renderer)throw Error('Chat log renderer not found');
 s=once(s,renderer,'');
 const chatEvent=s.split('\n').find(x=>x.startsWith("chat.addEventListener("));
 if(!chatEvent)throw Error('Chat form listener not found');
 s=once(s,chatEvent,'');
 if(/mpChat|send\(\{type:'chat'|chatMsgs|renderChat/.test(s))throw Error('Client chat code remains');
 return s;
});
modify('game/server.js',s=>{
 const start=s.indexOf("  if(msg.type==='chat'){");
 const end=s.indexOf("  if(msg.type==='pulse'){",start);
 if(start<0||end<0)throw Error('Server chat block not found');
 s=s.slice(0,start)+s.slice(end);
 s=once(s,'lastChat:0,','');
 if(s.includes("msg.type==='chat'"))throw Error('Server still accepts chat');
 return s;
});
modify('game/public/multiplayer.css',s=>{
 s=s.split('\n').filter(line=>
  !/^\.(?:mpChat|mpIncoming)/.test(line)&&
  !/^@keyframes mpIncoming/.test(line)&&
  !/^\/\* v0\.4\.1: unobtrusive chat/.test(line)
 ).join('\n').replace('.mpChat{bottom:7px;right:7px}','');
 s+='\n/* v0.4.2 flight controls: no chat UI, exit remains accessible */\n'+
   '.mpLeaveFlight{position:fixed;top:70px;right:14px;z-index:24;padding:7px 12px;'+
   'border-radius:8px;background:#071528dd;color:#cbfaff;border:1px solid #20bdda9a;'+
   'font:600 12px system-ui;cursor:pointer}\n'+
   '.mpLeaveFlight:hover{background:#123851}\n'+
   '@media(max-width:650px){.mpLeaveFlight{top:110px;right:8px;padding:6px 9px}}\n';
 return s;
});
console.log('A400M Online v0.4.2: all player chat removed; flight and 2-second state sync preserved');
