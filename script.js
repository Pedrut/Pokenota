const pokemons = [
 {nome:"Charmander", tipo:"Fogo", imgs:[
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
 ]},
 {nome:"Squirtle", tipo:"Água", imgs:[
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png"
 ]},
 {nome:"Bulbasaur", tipo:"Planta", imgs:[
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png"
 ]}
];

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
let atual = null;

function salvar(){
 localStorage.setItem("alunos", JSON.stringify(alunos));
}

function init(){
 let select = document.getElementById("pokemonSelect");

 pokemons.forEach((p,i)=>{
  let opt = document.createElement("option");
  opt.value = i;
  opt.textContent = p.nome;
  select.appendChild(opt);
 });

 render();
}

function addAluno(){
 let m = document.getElementById("matricula").value;
 let n = document.getElementById("nome").value;
 let nota = Number(document.getElementById("nota").value);
 let p = Number(document.getElementById("pokemonSelect").value);

 let aluno = {
  matricula: m,
  nome: n,
  pokemon: p,
  notas: []
 };

 if(nota) aluno.notas.push(nota);

 alunos.push(aluno);
 salvar();
 render();
}

function getPontos(a){
 return a.notas.reduce((s,v)=>s+v,0);
}

function getNivel(p){
 return Math.floor(p/100);
}

function selecionar(i){
 atual = i;
 atualizarAtual();
}

function atualizarAtual(){
 if(atual == null) return;

 let a = alunos[atual];
 let p = pokemons[a.pokemon];

 let pontos = getPontos(a);
 let nivel = getNivel(pontos);

 document.getElementById("alunoAtual").textContent = a.nome;
 document.getElementById("pontos").textContent = "Pontos: " + pontos;
 document.getElementById("pokemonImg").src = p.imgs[Math.min(nivel,2)];
}

function addNota(){
 if(atual == null) return;

 let val = Number(document.getElementById("novaNota").value);
 if(!val) return;

 alunos[atual].notas.push(val);
 salvar();
 render();
}

function editarNota(i,j){
 let val = prompt("Editar nota:", alunos[i].notas[j]);
 if(val === null) return;

 alunos[i].notas[j] = Number(val);
 salvar();
 render();
}

function removerNota(i,j){
 alunos[i].notas.splice(j,1);
 salvar();
 render();
}

function render(){
 alunos.sort((a,b)=>getPontos(b)-getPontos(a));

 let tbody = document.getElementById("ranking");
 tbody.innerHTML = "";

 alunos.forEach((a,i)=>{
  let tr = document.createElement("tr");

  let notasHTML = a.notas.map((n,j)=>
   `<span class='nota' onclick='editarNota(${i},${j})'>${n}</span>
    <button onclick='removerNota(${i},${j})'>x</button>`
  ).join(" ");

  tr.innerHTML = `
   <td>${a.matricula}</td>
   <td onclick="selecionar(${i})">${a.nome}</td>
   <td>${pokemons[a.pokemon].nome}</td>
   <td>${notasHTML}</td>
   <td>${getPontos(a)}</td>
   <td>${getNivel(getPontos(a))+1}</td>
  `;

  tbody.appendChild(tr);
 });

 renderTipo();
 atualizarAtual();
}

function renderTipo(){
 let mapa = {};

 alunos.forEach(a=>{
  let tipo = pokemons[a.pokemon].tipo;
  mapa[tipo] = (mapa[tipo] || 0) + getPontos(a);
 });

 let tbody = document.getElementById("rankingTipo");
 tbody.innerHTML = "";

 Object.entries(mapa)
 .sort((a,b)=>b[1]-a[1])
 .forEach(([tipo,p])=>{
  let tr = document.createElement("tr");
  tr.innerHTML = `<td>${tipo}</td><td>${p}</td>`;
  tbody.appendChild(tr);
 });
}

init();