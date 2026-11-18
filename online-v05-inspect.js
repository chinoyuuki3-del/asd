'use strict';
const fs=require('node:fs'), p='game/public/';
for(const name of ['index.html','multiplayer-v043.js','multiplayer-v043.css']){
const s=fs.readFileSync(p+name,'utf8');
console.log('INSPECT::'+name+' length '+s.length+' lines '+s.split('\n').length);
if(name==='index.html'){
console.log('INSPECT::HEAD',s.slice(0,1800).replace(/\s+/g,' '));
console.log('INSPECT::TAIL',s.slice(-2200).replace(/\s+/g,' '));
for(const re of [/function\s+(?:update|render|tick|simulate|reset|draw|physics|start|flight|plane|takeoff)\w*\s*\(/gi,/(?:let|const|var)\s+[\w\s,=]+(?:velocity|altitude|pos|vSpeed|aircraft|pitch|roll|speed|world|runway|airports)\w*/gi,/\b(?:plane|position|height|heading|airport|runway|terrain|terrainHeight|flightState|timeScale|throttle|gear|flaps|groundContact|onGround|crash|resetFlight)\b/gi,/<script[^>]*>|<link[^>]*>/gi]){
const out=[];let m;while((m=re.exec(s))&&out.length<45){out.push({at:m.index,match:s.slice(Math.max(0,m.index-75),Math.min(s.length,m.index+155)).replace(/\s+/g,' ')})}
console.log('INSPECT::MATCH',String(re),JSON.stringify(out));
}
}else{
for(const re of [/window\.\w+|globalThis\.\w+|function\s+\w+|setInterval\(|addEventListener\(|activePlaneId|inFlight|gameStarted|mpFlight|aircraft|flightState/gi]){
let m, out=[];while((m=re.exec(s))&&out.length<22)out.push(s.slice(Math.max(0,m.index-55),m.index+95).replace(/\s+/g,' '));console.log('INSPECT::JS',String(re),JSON.stringify(out))}
}
}