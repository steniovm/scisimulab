//const urlsimuls = 'https://steniovm.github.io/steniovm/simulacoes.json';
//const urldata = 'https://steniovm.github.io/steniovm/scisimulab.json';
const urlsimuls = 'simulacoes.json';
const urldata = 'scisimulab.json';
const unimage = "unimage.svg";
const menu = document.getElementById('menu');
const simulations = document.getElementById('simulations');
const highlight = document.getElementById('highlight');
const resources = document.getElementById('resources');
const filterall = document.getElementById('filterall');
const categorias = {};
const categoriasnome = [];
let simulist = [];

//lista cards de simulações
function listSimuls(list){
  let simuls = "";
  list.forEach((simulacao,index) => {
    if (index<12){
    simuls += (`
    <a class="card" href="${simulacao.url}">
      <h3>${simulacao.name}</h3>
      <img src="${simulacao.thumb ? simulacao.thumb : unimage}" alt="imagem da simulação ${simulacao.name}"/>
      <p>${simulacao.descript}</p>
      <label><strong>Categorias: </strong>${simulacao.categorys.join(', ')}</label>
      <label><strong>Autor: </strong>${simulacao.author}</label>
    </a>
    `);} else {
      simuls += (`
    <a class="card" href="${simulacao.url}">
      <h3>${simulacao.name}</h3>
      <label><strong>Categorias: </strong>${simulacao.categorys.join(', ')}</label>
      <label><strong>Autor: </strong>${simulacao.author}</label>
    </a>
    `);
    }
  });
  simulations.innerHTML = simuls;
}
//função para filtrar simulações
function filtercaterogy(key){
  simulations.innerHTML = "";
  listSimuls(categorias[key]);
}

fetch(urlsimuls)
  .then(response => response.json())
  .then(data => {
    // Percorre as simulações e registra as categorias
    data.sort((a, b) => a.name.localeCompare(b.name));
    data.forEach(simulacao => {
      simulacao.categorys.forEach(categoria => {
        if (!categorias[categoria]) {
          categorias[categoria] = [];
          categoriasnome.push(categoria);
        }
        categorias[categoria].push(simulacao);
      });
    });
    filterall.innerHTML = `Tudo (${data.length})`;
    // Percorre as categorias e cria os elementos do menu
    categoriasnome.sort();
    categoriasnome.forEach(categoria => {
      const categoriaItem = `
      <button onclick="filtercaterogy('${categoria}')">
        ${categoria} (${categorias[categoria].length})
      </button>`
      menu.innerHTML += categoriaItem;
    });
    listSimuls(data);
    simulist = data;
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });

//carrega simulações autorais
fetch(urldata)
  .then(response => response.json())
  .then(data => {
    // Percorre as simulações autorais
    data.autoral.forEach(simulacao => {
      const destaqueItem = document.createElement('a');
      destaqueItem.classList.add("emphasis");
      destaqueItem.href = simulacao.url;
      destaqueItem.innerHTML = simulacao.name;
      highlight.appendChild(destaqueItem);
    });
    data.fontes.forEach(fonte => {
      const fonteItem = document.createElement('a');
      fonteItem.classList.add("emphasis");
      fonteItem.href = fonte.url;
      fonteItem.innerHTML = fonte.text;
      resources.appendChild(fonteItem);
    });
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });