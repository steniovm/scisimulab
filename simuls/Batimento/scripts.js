const ElTONES = [16.5, 17.4735, 18.513, 19.6185, 20.79, 22.03, 23.33, 24.72, 26.19, 27.75, 29.4, 31.15];
const toit = ["EL","1ª","2ª","3ª","4ª","5ª","6ª","7ª","8ª","9ª","10ª"];
const canvawave = document.querySelector('canvas');
const volumerange = document.getElementById('volume');
const formwavelist = document.getElementsByName('formwave');
const Oitwavelist = document.getElementsByName('oitwave');
const Teclalist = document.querySelectorAll('.tecla');
const sToneWave = document.getElementById('sToneWave');
const playref = document.getElementById('playref');
const stopbt = document.getElementById('stopbt');
const playtest = document.getElementById('playtest');
const ajustfreq = document.getElementById('ajustfreq');
const ajustfreqfine = document.getElementById('ajustfreqfine');
const showfreq = document.getElementById('showfreq');
const tabela = document.getElementById('gabarito');
const ccanvawave = canvawave.getContext('2d');
let waves = {
    waveref : null,
    wavejus : null,
    waveint : null
}
let soundcontext = new AudioContext();
let oscillatorref = null;
let contextGain = null;
let volum = volumerange.value;
let tonewave = "";
let oit = 4;
let freq = 444.44;
let playing = false;
let playingtest = false;

if (screen.width < 1000){canvawave.width = screen.width;}

function formwaveselector(){
    let formwave = false;
    formwavelist.forEach(function(item){
        if (item.checked){
            formwave = item.value;
        }
    });
    return formwave;
}

function creatSound(nota){
    oscillatorref = soundcontext.createOscillator();
    contextGain = soundcontext.createGain();
    contextGain.gain.value = volum;
    oscillatorref.type = formwaveselector() || "sine";
    oscillatorref.frequency.value = parseFloat(nota);
    oscillatorref.start();
    oscillatorref.connect(contextGain);
    contextGain.connect(soundcontext.destination);
    playing = true;
}
function eixo(){
    ccanvawave.beginPath();
    ccanvawave.strokeStyle=('rgb(0,0,0)');
    ccanvawave.moveTo(0,canvawave.height/2);
    ccanvawave.lineTo(canvawave.width,canvawave.height/2);
    ccanvawave.stroke();
}
function senoide(x, fr){
    return Math.sin(2*Math.PI*x*fr)*volum;
}
function quadrada(x, fr){
    let a = parseFloat(x)%(1/fr);
    let b = (a<1/(2*fr)) ? 1 : -1;
    return b*volum;
}
function dente(x, fr){
    let a = parseFloat(x)%(1/fr);
    return (2*a*fr - 1)*volum;
}
function waveresult(x, fr){
    let refe = null;
    if (formwavelist[0].checked) refe = senoide(x, freq)+senoide(x,fr);
    if (formwavelist[1].checked) refe = quadrada(x, freq)+senoide(x,fr);
    if (formwavelist[2].checked) refe = dente(x, freq)+senoide(x,fr);
    return refe;
}
function drawwaveref(fr){
    ccanvawave.clearRect(0,0,ccanvawave.canvas.width,ccanvawave.canvas.height);
    eixo();
    if (formwavelist[0].checked) waves.waveref = drawwave(senoide, fr,'rgb(255,0,0)');
    if (formwavelist[1].checked) waves.waveref = drawwave(quadrada, fr,'rgb(255,0,0)');
    if (formwavelist[2].checked) waves.waveref = drawwave(dente, fr,'rgb(255,0,0)');
}
function drawwaveajust(fr){
    if (playing) drawwaveref(freq);
    eixo();
    drawwave(senoide,fr,'rgb(0,0,255)');
    if (playing) drawwave(waveresult,fr,'rgb(150,150,0)');
}
function drawwave(func, fr, cor){
    const dv = 1000;
    let dx = canvawave.width/dv;
    let ymax = canvawave.height/2;
    ccanvawave.beginPath();
    ccanvawave.lineTo(0,ymax);
    ccanvawave.strokeStyle = cor;
    for(let i=0;i<dv;i++){
        ccanvawave.lineTo(i*dx,ymax-(func(i/(dv*12.5),fr)*ymax));
    }
    ccanvawave.stroke();
}
function frequencyajust(){
    return parseFloat(ajustfreq.value)+parseFloat(ajustfreqfine.value);
}

showfreq.innerHTML = frequencyajust() + " Hz";
volumerange.addEventListener('change',function(){
    volum = volumerange.value;
    contextGain.gain.value = volum;
})
playref.addEventListener('click',function(){creatSound(444)});
stopbt.addEventListener('click', function(){
    contextGain.gain.exponentialRampToValueAtTime(0.00001,soundcontext.currentTime+2);
    //oscillatorref.disconnect(soundcontext.destination);
    //oscillatorref.stop();
    playing = false;
    ccanvawave.clearRect(0,0,ccanvawave.canvas.width,ccanvawave.canvas.height);
    Teclalist.forEach(function(item){item.classList.remove('teclap')});
    eixo();
});
Oitwavelist.forEach(function(item,index){
    item.addEventListener('click',function(){
        if (item.checked) oit = index;
    });
});
Teclalist.forEach(function(item,index){
    item.addEventListener('click',function(){
        Teclalist.forEach(function(item){item.classList.remove('teclap')});
        item.classList.add('teclap');
        freq = ElTONES[index]*Math.pow(2,oit);
        if (playing){
            contextGain.gain.exponentialRampToValueAtTime(0.00001,soundcontext.currentTime+2);
            playing = false;
        }
        creatSound(freq);
        drawwaveref(freq);
        console.log("frequencia: "+freq);
    });
});
ajustfreq.addEventListener('change',function(){
    showfreq.innerHTML = frequencyajust() + " Hz";
});
ajustfreqfine.addEventListener('change',function(){
    showfreq.innerHTML = frequencyajust() + " Hz";
});
playtest.addEventListener('click',function(){
    let oscillatortes = soundcontext.createOscillator();
    let contextGaintes = soundcontext.createGain();
    let frequ = frequencyajust();
    contextGaintes.gain.value = volum;
    oscillatortes.type = "sine";
    oscillatortes.frequency.value = frequ;
    oscillatortes.start();
    oscillatortes.connect(contextGaintes);
    contextGaintes.connect(soundcontext.destination);
    drawwaveajust(frequ);
    if (playing) {
        showfreq.innerHTML = `${frequ} Hz - Batimento: ${Math.round(100 * Math.abs(freq - frequ)) / 100} Hz`;
    }else{
        showfreq.innerHTML = frequ + " Hz";
    }
    console.log("frequencia: "+frequ);
    setTimeout(function(){
        contextGaintes.gain.exponentialRampToValueAtTime(0.00001,soundcontext.currentTime+2);
    },10000);
});

function printgab(lin){
    let linha = document.createElement("tr");
    let cel = new Array(ElTONES.length+1);
    cel[0] = document.createElement("td");
    cel[0].innerHTML = toit[lin];
    linha.append(cel[0]);
    for (let i=0; i<ElTONES.length;i++){
      cel[i+1] = document.createElement("td");
      cel[i+1].innerHTML = Math.round(100*ElTONES[i]*Math.pow(2,lin))/100;
      linha.append(cel[i+1]);
    }
    tabela.append(linha);
}
for(let i=0;i<toit.length;i++){
    printgab(i);
}