'use strict';
const fs=require('node:fs');
const src=fs.readFileSync('game/public/index.html','utf8');
const mark=src.lastIndexOf('<script>/* A400M Flight Dynamics');
const code=src.slice(mark);
console.log('DEEP::flight script at '+mark+' bytes '+code.length);
const queries=[
'function reset(){','function terrainH(','function buildScene(','function physics(dt,t)','function cameraAt(',
'function drawScene(','function drawPlane(','function updateUI(){','function start(){','window.FLIGHT_BRIDGE=',
'function setTime(','function makeAirportLights(','function render(dt,t)','let scene','const scene',
'function makeScene','function addBox','state.crash=true','state.crash=',"$('#", 'window.FLIGHT'
];
for(const q of queries){
let at=code.indexOf(q);
console.log('DEEP::'+q+' at '+at+' '+(at<0?'(no match)':code.slice(Math.max(0,at-220),Math.min(code.length,at+q.length+2600)).replace(/\s+/g,' ')));
}
