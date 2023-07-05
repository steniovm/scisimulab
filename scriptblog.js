//redimensiona iframe do artigo
const frame = document.getElementById('articleframe');
function autoResize(){
  let newheight;
  if(document.getElementById){
      newheight = frame.contentWindow.document.body.scrollHeight;
    }
  frame.style = `height: ${newheight*1.1}px;`;
}
frame.addEventListener('load',autoResize);
window.onresize = autoResize;
let counte = 0;
let interval = setInterval(()=>{
  autoResize();
  if(counte>=30) clearInterval(interval);
  counte++;
  },100);

//modo claro e escuro
const stylecss = document.getElementById('stylebasic');
const darklightbt = document.getElementById('darklightbt');
let darkmode = false;
let nimg = 0;
let savecookie = {
  "darkmode": darkmode,
  "nimg": nimg
};
//alterna modo claro e escuro
function darkmodes(){
  if (darkmode){
    stylecss.href = "../style.css";
  }else{
    stylecss.href = "../styledark.css";
  }
  darkmode = !darkmode;
  saveCookies();
}
//botão alterna modo claro e escuro
darklightbt.addEventListener('click',darkmodes);

//lé parametros de query
const urlParams = new URLSearchParams(location.search);
//restaura cookies
restoreCookies();
//controle de cookies
function restoreCookies(){
  if (document.cookie.indexOf('scisimulab')>=0){
      savecookie = JSON.parse(document.cookie.split("; ").find((row) => row.startsWith('scisimulab='))?.split("=")[1])
      darkmode = !(savecookie.darkmode);
      darkmodes();
      if (savecookie.nimg) parseInt(savecookie.nimg);
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

//mostra slides
//const urlarticles = 'https://scisimulab.vercel.app/articles.json';
const urlarticles = './urlarticles.json';
const unimage = "unimage.svg";
const slider = document.getElementById('slider');
let sliders = [];
let slidersa = [];
let showslider = 0;
let count = 0;
function showsliderers(){
  sliders = document.getElementsByName('slide');
  slidersa = document.getElementsByClassName('mycard');
  sliders[0].checked = true;
  showslider = setInterval(function(){
    count = (count+1) % sliders.length;
    sliders[count].checked = true;
  },5900);
}
//carrega dados de artigos
let articles = [];
let indexarticle = 0;
fetch(urlarticles)
  .then(response => response.json())
  .then(data => {
    articles = data;
    // Percorre os dados
    let card = "";
    let nint = (data.length>10) ? (data.length-10) : 0;
    let j = 0;
    for(let i=nint;i<data.length;i++){
      j = i-nimg;
      card += `
      <li>
        <input type="radio" id="slide${j}" name="slide">
        <label class="bullet" for="slide${j}" style="left: ${10+j*30}px"></label>
        <a class="card mycard" href="./blog/${data[j].url}" target="articleframe">
          <div>
              <h3>${data[j].title}</h3>
              <label><strong>Autor: </strong>${data[j].author}</label>
          </div>
          <img src="${data[j].thumb ? data[j].thumb : unimage}" alt="imagem do artigo ${data[j].title}"/>
        </a>
      </li>`
    }
    slider.innerHTML = card;
    showsliderers();
    opemArticleByQuery(querys.title)
    //opemwindow(querys.title);
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });

//abre artigo via indice
function opemArticlebyindex(n=0){
  frame.src = `./${articles[n].url}`;
}
//abre artigo via url query
let querys = {};
let hashlist = {};
querys.title = urlParams.get('title');
//abrir no iframe
function opemArticleByQuery(title){
  if (title){
    articles.forEach((article, index)=>{
      if (title+".html" === article.url){
        indexarticle = index;
        opemArticlebyindex(indexarticle);
      }
    });
  }
}
//abrir em nova janela (atualmente sem uso)
function opemwindow(title){
  if (title){
    let url = `./${title}.html`;
    window.open(url, "scisimulabWindow", "popup");
  }
}
//navega com botões anterior e proximo
const previous = document.getElementById('previous');
const next = document.getElementById('next');
function verifyEnableButton(){
  if (indexarticle<=0) previous.disabled = true;
  else previous.disabled = false;
  if (indexarticle>=(articles.length-1)) next.disabled = true;
  else next.disabled = false;
  console.log(indexarticle);
}
previous.addEventListener('click',()=>{
  opemArticlebyindex(indexarticle--);
  verifyEnableButton();
});
next.addEventListener('click',()=>{
  opemArticlebyindex(indexarticle++);
  verifyEnableButton();
});

//entrar em contato
const formmenss = document.getElementById('formmenss');
const contactforms = document.getElementById('contactforms');
const contactform = document.getElementById('contactform');
const closebt = document.getElementById('closebt');
const btmessage = document.getElementById('btmessage');
const spanmessage = document.getElementById('spanmessage');
const h1message = document.getElementById('h1message');
//formularios de contato
formmenss.addEventListener('click',function(){
  contactforms.classList.remove('hiddemdiv');
  contactform.classList.remove('hiddemdiv');
});
closebt.addEventListener('click',function(){
  contactforms.classList.add('hiddemdiv');
  contactform.classList.add('hiddemdiv');
});
btmessage.addEventListener('click',function(){
  contactforms.classList.add('hiddemdiv');
  contactform.classList.add('hiddemdiv');
  spanmessage.classList.remove('hiddemdiv');
  h1message.innerHTML = "EMAIL ENVIADO, Agradeçemos seu contato";
  setTimeout(function(){
    spanmessage.classList.add('hiddemdiv');
  },1500);
});

