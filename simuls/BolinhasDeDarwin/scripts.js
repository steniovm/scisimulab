const bodypage = document.getElementById('bodypage');
const nMordidas = document.getElementById('NMordidas');
const nPresas = document.getElementById('NPresas');
const textlog = document.getElementById('textlog');
const mycanvas = document.querySelector('canvas');
const gamerconfig = document.getElementById('gamerconfig');
const gamerplay = document.getElementById('gamerplay');
const biniciar = document.getElementById('Iniciar');
const biniciarfs = document.getElementById('IniciarFS');
const Saveps = document.getElementById('Saveps');
const nmord = document.getElementById('NM');
const npres = document.getElementById('NP');
const iraio = document.getElementById('IRaio');
const ltime = document.getElementById('ltime');
const ltimemax = document.getElementById('ltimemax');
const bRestart = document.getElementById('bRestart');
const IMax = document.getElementById('IMax');
const Itime = document.getElementById('Itime');
const IChance = document.getElementById('IChance');
const colorrgb = document.querySelectorAll('.icolor');
const mostAmb = document.getElementById('mostAmb');
const mostBol = document.getElementById('mostBol');
const Vmusic = document.getElementById('Vmusic');
const Vefect = document.getElementById('Vefect');
const efectsong = new Audio("./assets/drop.wav");
const oversong = new Audio("./assets/defeat-sound.mp3");
const music = new Audio("./assets/jigsaw-puzzle-background.mp3");
music.volume = Vmusic.value;
efectsong.volume = Vefect.value;
oversong.volume = Vefect.value;
if (screen.width < 800 && screen.height < 800){
    mycanvas.height = 360;
    mycanvas.width = 640;
}
if (screen.height > screen.width) {
    mycanvas.height = 640;
    mycanvas.width = 360;
}
let c = mycanvas.getContext('2d');
let paused = true;
let nbol = npres.value;
let rbol = iraio.value;
c.width = mycanvas.offsetWidth;
c.height = mycanvas.offsetHeight;
let bolinhas = [];
let energy = nmord.value;
let timegame = 0;
let timegamemax = 0;
let repchance = (IChance.value)/100;
let maxbols = Number.parseInt(IMax.value);
let reptime = Itime.value;
let contpresas = 0;
let preset = {
    energ:0,
    szbol:0,
    popini:0,
    popmax:0,
    timerp:0,
    repchc:0,
    musicv:0,
    efectv:0,
    red:0,
    green:0,
    blue:0
}
mostAmb.style.height = (2*iraio.value + 4)+'px';
mostAmb.style.width = (2*iraio.value + 4)+'px';
mostBol.style.height = (2*iraio.value)+'px';
mostBol.style.width = (2*iraio.value)+'px';

function setCookieTime() {
  const d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = 'boldarwintime' + "=" + timegamemax + ";" + expires + ";path=/";
}

if (document.cookie.indexOf('boldarwintime')>=0){
    timegamemax = JSON.parse(document.cookie.split("; ").find((row) => row.startsWith('boldarwintime='))?.split("=")[1])
    ltimemax.innerHTML = timegamemax;
}else{
    setCookieTime();
}
if (document.cookie.indexOf('boldarwinpreset')>=0){
    preset = JSON.parse(document.cookie.split("; ").find((row) => row.startsWith('boldarwinpreset='))?.split("=")[1])
    nmord.value = preset.energ;
    iraio.value = preset.szbol;
    npres.value = preset.popini;
    IMax.value = preset.popmax;
    Itime.value = preset.timerp;
    IChance.value = preset.repchc;
    Vmusic.value = preset.musicv;
    Vefect.value = preset.efectv;
    colorrgb[0].value = preset.red;
    colorrgb[1].value = preset.green;
    colorrgb[2].value = preset.blue;
    colorrgb[0].style.accentColor = "rgb("+preset.red+",0,0)";
    colorrgb[1].style.accentColor = "rgb(0,"+preset.green+",0)";
    colorrgb[2].style.accentColor = "rgb(0,0,"+preset.blue+")";
    mycanvas.style.backgroundColor = 'rgb(' + preset.red + ',' + preset.green + ',' + preset.blue + ')';
    mostAmb.style.backgroundColor = 'rgb(' + preset.red + ',' + preset.green + ',' + preset.blue + ')';
    mostBol.style.backgroundColor = 'rgb(' + (255-preset.red) + ',' + (255-preset.green) + ',' + (255-preset.blue) + ')';
}else{
    changeColor();
}
Saveps.addEventListener('click', function(){
  const d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  preset.energ = nmord.value;
  preset.szbol = iraio.value;
  preset.popini = npres.value;
  preset.popmax = IMax.value;
  preset.timerp = Itime.value;
  preset.repchc = IChance.value;
  preset.musicv = Vmusic.value;
  preset.efectv = Vefect.value;
  preset.red = colorrgb[0].value;
  preset.green = colorrgb[1].value;
  preset.blue = colorrgb[2].value;
  document.cookie = 'boldarwinpreset' + "=" + JSON.stringify(preset) + ";" + expires + ";path=/";
})

function changeColor(){
  let red = Math.floor(Math.random()*255);
  let green = Math.floor(Math.random()*255);
  let blue = Math.floor(Math.random()*255);
  mycanvas.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
  mostAmb.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
  mostBol.style.backgroundColor = 'rgb(' + (255-red) + ',' + (255-green) + ',' + (255-blue) + ')';
  colorrgb[0].value = red;
  colorrgb[0].style.accentColor = "rgb("+red+",0,0)";
  colorrgb[1].value = green;
  colorrgb[1].style.accentColor = "rgb(0,"+green+",0)";
  colorrgb[2].value = blue;
  colorrgb[2].style.accentColor = "rgb(0,0,"+blue+")";
}

function changeNewColor(){
  mycanvas.style.backgroundColor = 'rgb(' + colorrgb[0].value + ',' + colorrgb[1].value + ',' + colorrgb[2].value + ')';
}

function bolinha(x,y,raio,r,g,b){
    this.x = x + Math.floor(Math.random()*10 - 5);
    this.y = y + Math.floor(Math.random()*10 - 5);
    this.ra = raio;
    this.r = r + Math.floor(Math.random()*10 - 5);
    this.g = g + Math.floor(Math.random()*10 - 5);
    this.b = b + Math.floor(Math.random()*10 - 5);
    this.dx = Math.random() - 0.5;
    this.dy = Math.random() - 0.5;
    this.mostrar = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.ra, 0, 2*Math.PI);
        c.fillStyle=('rgb('+this.r+','+this.g+','+this.b+')');
        c.fill();
    }
    this.mover = function(){
        if(this.x+this.dx>0 && this.x+this.dx<c.width){
            this.x = this.x + this.dx;
        }else{
            this.dx = -this.dx;
            this.x = this.x + this.dx;
        }
        if(this.y+this.dy>0 && this.y+this.dy<c.height){
            this.y = this.y+this.dy;
        }else{
            this.dy = -this.dy;
            this.y = this.y+this.dy;
        }
        this.mostrar();
    }
    
}

function vetorbol(nb){
    let bolinhas = [];
    for(let i=0; i<nb; i++){
        let x = Math.floor(Math.random()*c.width);
        let y = Math.floor(Math.random()*c.height);
        let r = Math.floor(Math.random()*255);
        let g = Math.floor(Math.random()*255);
        let b = Math.floor(Math.random()*255);
        bolinhas.push(new bolinha(x,y,rbol,r,g,b));
    }
    nPresas.innerHTML = nb;
    return bolinhas;
}

function inicio(){
    if (paused) return;
    bolinhas = vetorbol(nbol);
    nPresas.style.width = ((1 - nbol/maxbols)*100)+'%';
    for(i=0;i<nbol;i++){
        bolinhas[i].mostrar();
    }
    mostrarbol();
}

function mostrarbol(){
    if (paused) return;
    c.clearRect(0,0,innerWidth,innerHeight);
    requestAnimationFrame(mostrarbol);
    for(i=0;i<nbol;i++){
        bolinhas[i].mover();
    }
}

function pinicio(){
    nbol = npres.value;
    rbol = iraio.value;
    energy = nmord.value;
    nMordidas.innerHTML = energy;
    nMordidas.style.width = (100-energy)+'%';
    maxbols = Number.parseInt(IMax.value);
    reptime = Itime.value;
    repchance = (IChance.value)/100;
    contpresas = 0;
    paused = false;
    music.play();
    music.loop = true;
    textlog.innerHTML = `Dados do jogo
Energia inicial: ${energy} mordidas
Raio das bolinhas: ${rbol} pixels
População inicial: ${nbol} bolinhas
População maxima: ${maxbols} bolinhas
Periodo de reprodução: ${reptime} segundos
Chance de reprodução: ${repchance*100}%
Ambiente: ${mycanvas.style.backgroundColor}`;
}

function clicar(e){
    if (paused) return;
    const rect = mycanvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    for(i=(nbol-1);i>=0;i--){
        let dx = mx-bolinhas[i].x;
        if (dx < 0 ) dx = - dx;
        let dy = my-bolinhas[i].y;
        if (dy < 0 ) dy = - dy;
        if((dx<(bolinhas[i].ra)) && (dy<(bolinhas[i].ra))){
            efectsong.play();
            textlog.innerHTML += "\nAcertou: ("+mx+","+my+")";
            textlog.scrollTop = textlog.scrollHeight;
            contpresas++;
            if (energy<100) energy++;
            nMordidas.innerHTML = energy;
            nMordidas.style.width = (100-energy)+'%';
            bolinhas.splice(i,1);
            nbol = bolinhas.length
            nPresas.innerHTML = nbol;
            nPresas.style.width = ((1 - nbol/maxbols)*100)+'%';
            return;
        }else{
            if (i == 0) {
                textlog.innerHTML += "\nErrou: ("+mx+","+my+")";
                textlog.scrollTop = textlog.scrollHeight;
                if (energy) energy--;
                nMordidas.innerHTML = energy;
                nMordidas.style.width = (100-energy)+'%';
            }
        }
    }
}
function newbirth(n){
    if (paused) return;
    let bolmae = bolinhas[n];
    let x = bolmae.x + Math.floor(Math.random()*10 - 5);;
    let y = bolmae.y + Math.floor(Math.random()*10 - 5);;
    let r = bolmae.r + Math.floor(Math.random()*50 - 25);
    if(r > 255) r = 254;
    if(r < 0) r = 1;
    let g = bolmae.g + Math.floor(Math.random()*50 - 25);
    if(g > 255) g = 254;
    if(g < 0) g = 1;
    let b = bolmae.b + Math.floor(Math.random()*50 - 25);
    if(b > 255) b = 254;
    if(b < 0) b = 1;
    bolinhas.push(new bolinha(x,y,rbol,r,g,b));
    nbol = bolinhas.length
    nPresas.innerHTML = nbol;
    nPresas.style.width = ((1 - nbol/maxbols)*100)+'%';
}

async function pastime(){
    if (paused) return;
    let timeciclo = 0;
    let interval = setInterval(function(){
        timegame++;
        timeciclo++;
        ltime.innerHTML = timegame;
        if (nbol>=maxbols){
            clearInterval(interval);
            textlog.innerHTML += "\nAs bolinhas dominaram o mundo e mataram os predadores!!!";
            textlog.innerHTML += "\nVoce sobreviveu por "+timegame+" segundos e abateu "+contpresas+" presas!";
            textlog.scrollTop = textlog.scrollHeight;
            music.pause();
            oversong.play();
            document.exitFullscreen();
            if (timegame > timegamemax){
                timegamemax = timegame;
                ltimemax.innerHTML = timegamemax;
                setCookieTime();
            }
            paused = true;
        }else if (nbol<=0){
            clearInterval(interval);
            textlog.innerHTML += "\nAs bolinhas foram extintas e os predadores morreram de fome!!!";
            textlog.innerHTML += "\nVoce sobreviveu por "+timegame+" segundos e abateu "+contpresas+" presas!";
            textlog.scrollTop = textlog.scrollHeight;
            music.pause();
            oversong.play();
            document.exitFullscreen();
            if (timegame > timegamemax){
                timegamemax = timegame;
                ltimemax.innerHTML = timegamemax;
                setCookieTime();
            }
            paused = true;
        }else if (energy <= 0){
            clearInterval(interval);
            textlog.innerHTML += "\nSua energia vital acabou e voce desfaleceu!!!";
            textlog.innerHTML += "\nVoce sobreviveu por "+timegame+" segundos e abateu "+contpresas+" presas!";
            textlog.scrollTop = textlog.scrollHeight;
            music.pause();
            oversong.play();
            document.exitFullscreen();
            if (timegame > timegamemax){
                timegamemax = timegame;
                setCookieTime();
            }
            paused = true;
        }
        let max = bolinhas.length;
        if (timeciclo==reptime){
            if (energy > 0) {
                energy--;
                nMordidas.innerHTML = energy;
                nMordidas.style.width = (100-energy)+'%';
            }
            let s = 0
            for(let i=0;i<max;i++){
            s = Math.random();
            if (s < repchance) {
                newbirth(i);
            }
            }
            timeciclo = 0;
        }
    },1000); 
}
function iniciargame(){
    gamerconfig.style.display = "none";
    gamerplay.style.display = "flex";
    pinicio();
    inicio();
    mostrarbol();
    pastime();
    changeNewColor();
}
biniciar.addEventListener("click", function(){
    iniciargame();
});
biniciarfs.addEventListener("click", function(){
    enterfullscreem();
    iniciargame();
});
bRestart.addEventListener("click", function(){
    gamerconfig.style.display = "flex";
    music.loop = false;
    bolinhas = [];
    timegame = 0;
    paused = true;
})

colorrgb[0].addEventListener('change', function(){
    colorrgb[0].style.accentColor = "rgb("+colorrgb[0].value+",0,0)";
    mostAmb.style.backgroundColor = "rgb("+colorrgb[0].value+","+colorrgb[1].value+","+colorrgb[2].value+")";
})
colorrgb[1].addEventListener('change', function(){
    colorrgb[1].style.accentColor = "rgb(0,"+colorrgb[1].value+",0)";
    mostAmb.style.backgroundColor = "rgb("+colorrgb[0].value+","+colorrgb[1].value+","+colorrgb[2].value+")";
})
colorrgb[2].addEventListener('change', function(){
    colorrgb[2].style.accentColor = "rgb(0,0,"+colorrgb[2].value+")";
    mostAmb.style.backgroundColor = "rgb("+colorrgb[0].value+","+colorrgb[1].value+","+colorrgb[2].value+")";
})
iraio.addEventListener('change', function(){
    mostAmb.style.height = (2*iraio.value + 4)+'px';
    mostAmb.style.width = (2*iraio.value + 4)+'px';
    mostBol.style.height = (2*iraio.value)+'px';
    mostBol.style.width = (2*iraio.value)+'px';
})
Vmusic.addEventListener('change', function(){
    music.volume = Vmusic.value;
    music.play();
    setTimeout(function (){
        music.pause();
    },500);
});
Vefect.addEventListener('change', function(){
    efectsong.volume = Vefect.value;
    oversong.volume = Vefect.value;
    efectsong.play();
});

mycanvas.addEventListener('mouseup',clicar,true);

function enterfullscreem(){
    if (mycanvas.requestFullscreen){
        mycanvas.requestFullscreen();
    }
    else if (mycanvas.msRequestFullscreen){
        mycanvas.msRequestFullscreen();
    }
    else if (mycanvas.mozRequestFullScreen){
        mycanvas.mozRequestFullScreen();
    }
}