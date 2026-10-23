const pcOriginal=JSON.stringify({nodes,edges});
function validProject(g){return g&&Array.isArray(g.nodes)&&Array.isArray(g.edges)&&g.nodes.length<=30&&new Set(g.nodes.map(n=>n.id)).size===g.nodes.length&&g.nodes.every(n=>Number.isInteger(n.id)&&n.id>0&&typeof n.name==='string'&&Number.isFinite(n.x)&&Number.isFinite(n.y))&&g.edges.every(e=>Number.isInteger(e.id)&&g.nodes.some(n=>n.id===e.from)&&g.nodes.some(n=>n.id===e.to)&&e.from!==e.to&&Number.isFinite(e.weight)&&e.weight!==0&&Math.abs(e.weight)<=1)&&new Set(g.edges.map(e=>[e.from,e.to].sort((a,b)=>a-b).join(':'))).size===g.edges.length}
function applyProject(g){if(!validProject(g))throw Error('Неверный формат карты, веса или повторяющиеся связи.');nodes=g.nodes;edges=g.edges;uid=Math.max(0,...edges.map(e=>e.id))+1;selected=null;options();draw()}
try{const saved=JSON.parse(localStorage.getItem('pc-cognitive-lab2'));if(saved)applyProject(saved)}catch(e){}
const drawGraph=draw;draw=function(){drawGraph();try{localStorage.setItem('pc-cognitive-lab2',JSON.stringify({nodes,edges}))}catch(e){}};
$('saveProject').onclick=()=>download(new Blob([JSON.stringify({nodes,edges},null,2)],{type:'application/json'}),'pc-project.json');
$('loadProject').onchange=async e=>{try{const f=e.target.files[0];if(f){applyProject(JSON.parse(await f.text()));refreshAnalysis();message('Карта загружена.')}}catch(e){message(e.message)}finally{e.target.value=''}};
$('resetPc').onclick=()=>{if(confirm('Восстановить исходную карту ПК вместо текущей?')){applyProject(JSON.parse(pcOriginal));refreshAnalysis()}};

refreshAnalysis();
