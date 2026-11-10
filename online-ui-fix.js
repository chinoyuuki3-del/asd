'use strict';
// Small top chat, no history, return keyboard to aircraft; apply after unzipping.
const fs = require('fs');
function apply(file, transformations) {
 let data=fs.readFileSync(file,'utf8');
 for(const [oldText,newText] of transformations){
  if(!data.includes(oldText))throw Error('A400M patch source changed: '+oldText.slice(0,55));
  data=data.replace(oldText,newText);
 }
 fs.writeFileSync(file,data);
}
apply('game/public/multiplayer.js',[
 ['<div id="mpChatLog" class="mpChatLog" role="log" aria-live="polite"></div>',''],
 ["case 'chat':chatMsgs.push({name:msg.from.name,text:msg.text});if(chatMsgs.length>100)chatMsgs.shift();renderChat();break;", "case 'chat':showIncoming(msg.from?.name,msg.text);break;"],
 ["function maybeNotify(title,body)","function showIncoming(name,message){const e=document.createElement('div');e.className='mpIncoming';e.textContent=String(name||'友達')+'：'+String(message||'');document.body.appendChild(e);setTimeout(()=>e.remove(),3500);}function maybeNotify(title,body)"],
 ["chatMsgs=[];renderChat();const myPlane=","document.activeElement?.blur?.();const myPlane="],
 ["el.value='';el.focus();","el.value='';el.blur();"],
 ["$('mpChatForm').addEventListener('submit',","chat.addEventListener('keydown',e=>{if(e.code==='Escape')$('mpChatInput').blur();});$('mpChatForm').addEventListener('submit',"]
]);
apply('game/public/index.html',[
 ["try{await Promise.all([loadExtraModel(activePlaneId),loadExtraModel(remotePlaneId)]);}catch(e){console.warn('追加の機体モデルを読み込めません:',e.message);}",
  "Promise.all([loadExtraModel(activePlaneId),loadExtraModel(remotePlaneId)]).catch(e=>console.warn('追加の機体モデルを読み込めません:',e.message));"]
]);

fs.appendFileSync('game/public/multiplayer.css',"\n/* v0.4.1: unobtrusive chat box during flight */\n.mpChat{top:67px!important;left:50%!important;right:auto!important;bottom:auto!important;transform:translateX(-50%);width:min(250px,calc(100vw - 20px))!important;border-radius:9px!important;font:11px/1.15 system-ui!important;box-shadow:0 0 10px #00c8ed22!important}\n.mpChatHead{padding:3px 7px!important;font-size:10px!important;min-height:22px!important}\n.mpChatHead .mpBtn{font-size:10px!important;padding:2px 5px!important;border-radius:5px!important}\n.mpChatForm input{padding:6px 8px!important;min-height:29px!important;font-size:11px!important}\n.mpChatForm button{padding:0 8px!important;font-size:11px!important}\n.mpChatLog{display:none!important}\n.mpIncoming{position:fixed;z-index:26;top:134px;left:50%;transform:translateX(-50%);max-width:min(330px,90vw);border:1px solid #28dbf0a8;border-radius:9px;background:#061322e8;color:#fff;padding:8px 12px;font:12px/1.35 system-ui;pointer-events:none;word-break:break-word;animation:mpIncoming 3.5s ease forwards}\n@keyframes mpIncoming{0%{opacity:0}10%,70%{opacity:1}100%{opacity:0}}\n@media(max-width:650px){.mpChat{top:78px!important;left:50%!important;right:auto!important;bottom:auto!important}.mpIncoming{top:145px}}\n");
console.log('A400M online UI v0.4.1 patched');
