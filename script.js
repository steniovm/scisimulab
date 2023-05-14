const urlsimuls = 'https://steniovm.github.io/steniovm/simulacoes.json';
const urldata = 'https://steniovm.github.io/steniovm/scisimulab.json';
const menu = document.getElementById('menu');
const simulations = document.getElementById('simulations');
const highlight = document.getElementById('highlight');
const resources = document.getElementById('resources');
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
      <img src="${simulacao.thumb}" alt="imagem da simulação ${simulacao.name}"/>
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
    data.forEach(simulacao => {
      simulacao.categorys.forEach(categoria => {
        if (!categorias[categoria]) {
          categorias[categoria] = [];
          categoriasnome.push(categoria);
        }
        categorias[categoria].push(simulacao);
      });
    });
    // Percorre as categorias e cria os elementos do menu
    categoriasnome.forEach(categoria => {
      const categoriaItem = `<button onclick="filtercaterogy('${categoria}')">${categoria}</button>`
      menu.innerHTML += categoriaItem;
    });
    listSimuls(data);
    simulist = data;
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });

//carrega destaques
fetch(urldata)
  .then(response => response.json())
  .then(data => {
    // Percorre as simulações e registra os destaques
    data.destaques.forEach(simulacao => {
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