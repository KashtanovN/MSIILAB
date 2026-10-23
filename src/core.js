'use strict';
const Analysis = (()=>{
function matrix(nodes,edges){return nodes.map(a=>nodes.map(b=>edges.find(e=>e.from===a.id&&e.to===b.id)?.weight||0))}
function cycles(A){const found=[];let visits=0;for(let start=0;start<A.length;start++){const path=[start],seen=new Set(path);function dfs(v){if(++visits>200000)throw Error('Слишком много путей для полного перебора циклов. Уменьшите плотность графа.');for(let j=start;j<A.length;j++){if(!A[v][j])continue;if(j===start){const w=path.map((v,k)=>A[v][path[(k+1)%path.length]]);found.push({path:[...path],product:w.reduce((a,b)=>a*b,1)})}else if(!seen.has(j)){seen.add(j);path.push(j);dfs(j);path.pop();seen.delete(j)}}}dfs(start)}return found}
function simulate(A,initial,q,steps){if(!Number.isInteger(steps)||steps<0||steps>100)throw Error('Количество шагов: целое число от 0 до 100.');if(initial.length!==A.length||q.length!==A.length||[...initial,...q].some(v=>!Number.isFinite(v)))throw Error('Проверьте исходные значения и импульсы.');let p=q.slice(),v=initial.map((x,i)=>x+p[i]);const P=[p],V=[v];for(let t=0;t<steps;t++){p=A.map((_,j)=>A.reduce((s,row,i)=>s+row[j]*p[i],0));v=v.map((x,i)=>x+p[i]);if([...v,...p].some(x=>!Number.isFinite(x)))throw Error('Переполнение расчёта. Уменьшите число шагов.');P.push(p);V.push(v)}return {P,V}}
// Воздействия для исходной карты ПК: программы, охлаждение, диагностика и действия.
const plans=[{name:'Комплексное обслуживание',q:{1:-1,5:1,11:1,12:1}},{name:'Разгрузка программ',q:{1:-1}},{name:'Улучшение охлаждения',q:{5:1}}];
function scenarios(nodes,A,steps=10){if(![1,5,6,11,12].every(id=>nodes.some(n=>n.id===id)))throw Error('Для сценариев ПК нужны вершины V1, V5, V6, V11, V12 исходной карты.');return ['Положительная ситуация','Негативная ситуация'].flatMap((group,g)=>plans.map((plan,k)=>{const scale=[1,-1][g],q=nodes.map(n=>(plan.q[n.id]||0)*scale);return {name:group+' №'+(k+1),description:g===0?plan.name:['Недостаточное обслуживание','Рост числа программ','Ухудшение охлаждения'][k],q,...simulate(A,Array(nodes.length).fill(0),q,steps)}}))}
return {matrix,cycles,simulate,scenarios};
})();
if(typeof module!=='undefined')module.exports=Analysis;
