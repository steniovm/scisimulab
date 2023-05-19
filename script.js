const urlsimuls = 'https://scisimulab.vercel.app/simulacoes.json';
const urldata = 'https://scisimulab.vercel.app/scisimulab.json';
//const urlsimuls = 'simulacoes.json';
//const urldata = 'scisimulab.json';
const unimage = "unimage.svg";
const stylecss = document.querySelector('link');
const menu = document.getElementById('menu');
const simulations = document.getElementById('simulations');
const highlight = document.getElementById('highlight');
const resources = document.getElementById('resources');
const filterall = document.getElementById('filterall');
const titlecat = document.getElementById('titlecat');
const slider = document.getElementById('slider');
const nimages = document.getElementById('nimages');
const darklightbt = document.getElementById('darklightbt');
const categorias = {};
const categoriasnome = [];
let simulist = [];
let sliders = [];
let count = 0;
let showslider = 0;
let nimg = nimages.value;
let darkmode = false;
let restore = true;
let savecookie = {
  "darkmode": darkmode,
  "nimg": nimg
};
console.log(document.cookie);
//controle de cookies
function restoreCookies(){
  if (document.cookie.indexOf('scisimulab')>=0){
      savecookie = JSON.parse(document.cookie.split("; ").find((row) => row.startsWith('scisimulab='))?.split("=")[1])
      darkmode = savecookie.darkmode;
      darkmodes();
      nimg = savecookie.nimg ? parseInt(savecookie.nimg) : nimages.value;
      nimages.value = nimg;
   }
   restore = false;
}
function saveCookies(){
  savecookie = {
    "darkmode": darkmode,
    "nimg": nimg
  };
  const date = new Date();
  date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
  const cookieexpires = "; expires="+date.toUTCString()+ ";path=/";
  document.cookie = "scisimulab="+JSON.stringify(savecookie)+cookieexpires;
}
//lista cards de simulações
function listSimuls(list, tudo=false){
  let simuls = "";
  list.forEach((simulacao,index) => {
    if (index<nimg){
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
  if (tudo) titlecat.innerHTML = "Todas:";
  simulations.innerHTML = simuls;
}
//função para filtrar simulações
function filtercaterogy(key){
  simulations.innerHTML = "";
  listSimuls(categorias[key]);
  titlecat.innerHTML = key+":";
}
function showsliderers(){
  sliders = document.getElementsByName('slide');
  sliders[0].checked = true;
  showslider = setInterval(function(){
    count = (count+1) % sliders.length;
    sliders[count].checked = true;
  },5900);
}
//alterna modo claro e escuro
function darkmodes(){
  if (darkmode){
    stylecss.href = "style.css";
  }else{
    stylecss.href = "styledark.css";
  }
  saveCookies();
  darkmode = !darkmode;
}
//botão alterna modo claro e escuro
darklightbt.addEventListener('click',darkmodes);
//numero de imagens
nimages.addEventListener('change',function(){
  if (!restore){
  nimg = nimages.value;
  saveCookies();
  }
});

//restaura cookies
restoreCookies();

//Carrega cards de simulações
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
    nimages.max = data.length;
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });

//carrega simulações autorais
fetch(urldata)
  .then(response => response.json())
  .then(data => {
    // Percorre as simulações autorais
    let card = "";
    let mysimul = data.autoral;
    for(let i=0;i<mysimul.length;i++){
      card += `
      <li>
        <input type="radio" id="slide${i}" name="slide">
        <label class="bullet" for="slide${i}" style="left: ${10+i*30}px"></label>
        <a class="card mycard" href="${mysimul[i].url}">
          <div>
              <h3>${mysimul[i].name}</h3>
              <label><strong>Categorias: </strong>${mysimul[i].categorys.join(', ')}</label>
              <label><strong>Autor: </strong>${mysimul[i].author}</label>
          </div>
          <img src="${mysimul[i].thumb ? mysimul[i].thumb : unimage}" alt="imagem da simulação ${mysimul[i].name}"/>
          <p>${mysimul[i].descript}</p>
        </a>
      </li>`
    }
    slider.innerHTML = card;
    showsliderers();
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