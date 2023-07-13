//const urlsimuls = 'https://scisimulab.vercel.app/simulacoes.json';
//const urldata = 'https://scisimulab.vercel.app/scisimulab.json';
const urlsimuls = 'simulacoes.json';
const urldata = 'scisimulab.json';
const unimage = "unimage.svg";
const initcategory = "*SciSimuLab*";
const stylecss = document.querySelector('link');
const menu = document.getElementById('menu');
const menua = document.getElementById('menua');
const simulations = document.getElementById('simulations');
const highlight = document.getElementById('highlight');
const resources = document.getElementById('resources');
const filterall = document.getElementById('filterall');
const filteraut = document.getElementById('filteraut');
const titlecat = document.getElementById('titlecat');
const slider = document.getElementById('slider');
const nimages = document.getElementById('nimages');
const darklightbt = document.getElementById('darklightbt');
const formsimul = document.getElementById('formsimul');
const formmenss = document.getElementById('formmenss');
const contactforms = document.getElementById('contactforms');
const insertform = document.getElementById('insertform');
const contactform = document.getElementById('contactform');
const closebt = document.getElementById('closebt');
const btinsert = document.getElementById('btinsert');
const btmessage = document.getElementById('btmessage');
const spanmessage = document.getElementById('spanmessage');
const h1message = document.getElementById('h1message');
const categorias = {};
const categoriasnome = [];
const autores = {};
const autoresnome = [];
let simulist = [];
let mysimul = [];
let sliders = [];
let slidersa = [];
let slidersurl = [];
let count = 0;
let showslider = 0;
let nimg = 0;
let darkmode = false;
let querys = {};
let hashlist = {};
let savecookie = {
  "darkmode": darkmode,
  "nimg": nimg
};
//lé parametros de query
const urlParams = new URLSearchParams(location.search);
//restaura cookies
restoreCookies();
//controle de cookies
function restoreCookies(){
  if (document.cookie.indexOf('scisimulab')>=0){
    let cookie = document.cookie.split("; ").find((row) => row.startsWith('scisimulab='));
    if (cookie) savecookie = JSON.parse(cookie.split("=")[1]);
    darkmode = !(savecookie.darkmode);
    darkmodes();
    nimg = savecookie.nimg ? parseInt(savecookie.nimg) : nimages.value;
    nimages.value = (nimg>0) ? nimg : nimages.value;
   }
}
function saveCookies(){
  savecookie = {
    "darkmode": darkmode,
    "nimg": (nimg===0) ? savecookie.nimg : nimg
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
    <a class="card" href="${simulacao.url}" target="scisimulabWindow">
      <h3>${simulacao.name}</h3>
      <img src="${simulacao.thumb ? simulacao.thumb : unimage}" alt="imagem da simulação ${simulacao.name}"/>
      <p>${simulacao.descript}</p>
      <label><strong>Categorias: </strong>${simulacao.categorys.join(', ')}</label>
      <label><strong>Autor: </strong>${simulacao.author}</label>
    </a>
    `);} else {
      simuls += (`
    <a class="card" href="${simulacao.url}" target="scisimulabWindow">
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
//função para filtrar simulações por categoria
function filtercaterogy(key){
  simulations.innerHTML = "";
  listSimuls(categorias[key]);
  titlecat.innerHTML = key+":";
}
//função para filtrar simulações por autor
function filteraltor(key){
  simulations.innerHTML = "";
  listSimuls(autores[key]);
  titlecat.innerHTML = key+":";
}
function showsliderers(){
  sliders = document.getElementsByName('slide');
  slidersa = document.getElementsByClassName('mycard');
  sliders[0].checked = true;
  clearInterval(showslider);
  showslider = setInterval(function(){
    count = (count+1) % sliders.length;
    sliders[count].checked = true;
  },5900);
}
//abre simulação via url query
querys.hash = urlParams.get('simu');
function opemwindowhash(hash){
  if (hashlist[hash]){
    let url = hashlist[hash];
    window.open(url, "scisimulabWindow", "popup");
  }
}
function opemwindow(url){
  window.open(url, "scisimulabWindow", "popup");
}

//alterna modo claro e escuro
function darkmodes(){
  if (darkmode){
    stylecss.href = "style.css";
  }else{
    stylecss.href = "styledark.css";
  }
  darkmode = !darkmode;
  saveCookies();
}
//botão alterna modo claro e escuro
darklightbt.addEventListener('click',darkmodes);
//numero de imagens
nimages.addEventListener('change',function(){
  if(!(nimg==nimages.value)){
    nimg = nimages.value;
    saveCookies();
  }
});
//formularios de contato
formsimul.addEventListener('click',function(){
  contactforms.classList.remove('hiddemdiv');
  insertform.classList.remove('hiddemdiv');
  contactform.classList.add('hiddemdiv');
});
formmenss.addEventListener('click',function(){
  contactforms.classList.remove('hiddemdiv');
  insertform.classList.add('hiddemdiv');
  contactform.classList.remove('hiddemdiv');
});
closebt.addEventListener('click',function(){
  contactforms.classList.add('hiddemdiv');
  insertform.classList.add('hiddemdiv');
  contactform.classList.add('hiddemdiv');
});
btinsert.addEventListener('click',function(){
  contactforms.classList.add('hiddemdiv');
  insertform.classList.add('hiddemdiv');
  contactform.classList.add('hiddemdiv');
  spanmessage.classList.remove('hiddemdiv');
  h1message.innerHTML = "SIMULAÇÃO ENVIADA PARA ANÁLISE, Agradeçemos sua contribuição";
  setTimeout(function(){
    spanmessage.classList.add('hiddemdiv');
  },1500);
});
btmessage.addEventListener('click',function(){
  contactforms.classList.add('hiddemdiv');
  insertform.classList.add('hiddemdiv');
  contactform.classList.add('hiddemdiv');
  spanmessage.classList.remove('hiddemdiv');
  h1message.innerHTML = "EMAIL ENVIADO, Agradeçemos seu contato";
  setTimeout(function(){
    spanmessage.classList.add('hiddemdiv');
  },1500);
});
//Carrega cards de simulações
fetch(urlsimuls)
  .then(response => response.json())
  .then(data => {
    data.sort((a, b) => a.name.localeCompare(b.name));
    // Percorre as simulações e registra as categorias e autores
    data.forEach(simulacao => {
      //categorias
      simulacao.categorys.forEach(categoria => {
        if (!categorias[categoria]) {
          categorias[categoria] = [];
          categoriasnome.push(categoria);
        }
        categorias[categoria].push(simulacao);
      });
      hashlist[simulacao.hash] = simulacao.url;
      filterall.innerHTML = `Tudo (${data.length})`;
      //autores
      if (!autores[simulacao.author]) {
        autores[simulacao.author] = [];
        autoresnome.push(simulacao.author);
      }
      autores[simulacao.author].push(simulacao);
      filteraut.innerHTML = `Todos (${data.length})`;
    });
    opemwindowhash(querys.hash);
    // Percorre as categorias e cria os elementos do menu categorias
    categoriasnome.sort();
    categoriasnome.forEach((categoria) => {
      const categoriaItem = `
      <button onclick="filtercaterogy('${categoria}')">
        ${categoria} (${categorias[categoria].length})
      </button>`
      menu.innerHTML += categoriaItem;
    });
    // Percorre as categorias e cria os elementos do menu autores
    autoresnome.sort();
    autoresnome.forEach((author) => {
      const autorItem = `
      <button onclick="filteraltor('${author}')">
        ${author} (${autores[author].length})
      </button>`
      menua.innerHTML += autorItem;
    });
    simulist = data;
    nimages.max = data.length;
    if (categorias[initcategory].length) listSimuls(categorias[initcategory]);
    else listSimuls(simulist);
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });
//cria slides de capa
function createSlides(){
  let card = "";
  for(let i=0;i<mysimul.length;i++){
    slidersurl.push(mysimul[i].url);
    card += `
    <li onclick="opemwindow(slidersurl[count])">
      <input type="radio" id="slide${i}" name="slide">
      <label class="bullet" for="slide${i}" style="left: ${10+i*30}px"></label>
      <a class="card mycard" href="${mysimul[i].url}" target="scisimulabWindow">
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
  slider.innerHTML += card;
  showsliderers();
}

//carrega simulações autorais
fetch(urldata)
  .then(response => response.json())
  .then(data => {
    // Percorre as simulações autorais
    mysimul = data.autoral;
    createSlides();
    data.fontes.forEach(fonte => {
      const fonteItem = document.createElement('a');
      fonteItem.classList.add("emphasis");
      fonteItem.href = fonte.url;
      fonteItem.innerHTML = `<img src="${fonte.thumb}" alt="imagem de colaborador"/>${fonte.text}`;
      resources.appendChild(fonteItem);
    });
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });
  //cria menu de artigos
const articleslinks = document.getElementById('articleslinks');
function menuCreate(){
  for(let i=(articles.length-1);i>=0;i--){
    const li = document.createElement('li');
    const a = document.createElement('a');
    li.classList.add('li');
    a.classList.add('articlelink');
    a.href = `https://www.scisimulab.com.br/blog?title=${articles[i].url}`;
    a.target = "articleframe";
    a.innerHTML = articles[i].title;
    a.addEventListener('click',()=>{
      opemArticlebyindex(i);
    });
    li.appendChild(a);
    articleslinks.appendChild(li);
  }
}
//cria slides de artigos
function slidesCreate(){
  setTimeout(()=>{},600);
  let card = "";
  let nint = (articles.length>10) ? (articles.length-10) : 0;
  let j = 0;
  let nsldsimu = (mysimul.length>10) ? 11 : (mysimul.length+1);
  for(let i=nint;i<articles.length;i++){
    j = i-nint;
    slidersurl.push(`./blog/${articles[j].url}`);
    card += `
    <li onclick="opemwindow(slidersurl[count])">
      <input type="radio" id="slide${(j+nsldsimu)}" name="slide">
      <label class="bullet" for="slide${(j+nsldsimu)}" style="left: ${10+(j+nsldsimu)*30}px"></label>
      <a class="card mycard" href="./blog/${articles[j].url}.html" target="articleframe">
        <div>
            <h3>${articles[j].title}</h3>
            <label><strong>Autor: </strong>${articles[j].author}</label>
        </div>
        <img src="${articles[j].thumb ? articles[j].thumb : unimage}" alt="imagem do artigo ${articles[j].title}"/>
      </a>
    </li>`
  }
  slider.innerHTML += card;
  showsliderers();
}
//carrega dados de artigos
const urlarticles = 'https://scisimulab.vercel.app/blog/urlarticles.json';
let articles = [];
let indexarticle = 0;
fetch(urlarticles)
  .then(response => response.json())
  .then(data => {
    articles = data;
    slidesCreate();
    menuCreate();
    //opemwindowhash(querys.title);
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });