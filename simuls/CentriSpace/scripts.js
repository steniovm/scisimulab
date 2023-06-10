const canvasstation = document.getElementById('canvasstation');
const ctxcanva = canvasstation.getContext("2d");
const canvaspeso = document.getElementById('canvaspeso');
const ctxcanvap = canvaspeso.getContext("2d");
const startcond = document.getElementById('startcond');
const pausecond = document.getElementById('pausecond');
const inraio = document.getElementById('inraio');
const inrot = document.getElementById('inrot');
const inmass = document.getElementById('inmass');
const rpmtohz = document.getElementById('rpmtohz');
const output = document.getElementById('output');
const outputv = document.getElementById('outputv');
const imgstation = document.createElement('img');
const imgstationc = document.createElement('img');
const imgpeso = document.createElement('img');
const maxWidth = canvasstation.width;
const maxHeight = canvasstation.height;
const pWidth = canvaspeso.width;
const pHeight = canvaspeso.height;
const gterra = 9.80665;
const numberstarts = 200;
const stars = [];
const dtime = 30;
imgstation.src = './spacestation.svg';
imgstationc.src = './spacestationcenter.svg';
imgpeso.src = './peso.svg';
let raio = parseInt(inraio.value);
let velocidadeAngular = parseFloat(inrot.value);
let velocidade = 5;
let massa = parseFloat(inmass.value);
let aceleracaoCentripeta = Math.pow(velocidadeAngular, 2) * raio;
let gravidade = calcularGravidadeArtificial(raio, velocidadeAngular);
let ang = 0;
let dang = 1;
let rotation = 0;
//estruturas das estrelas
function star(){
    this.x = Math.random()*maxWidth;
    this.y = Math.random()*maxHeight;
    this.size = Math.random();
    let compred = 205 + Math.random()*50;
    let compgreen = 205 + Math.random()*50;
    let compblue = 205 + Math.random()*50;
    this.color = "rgb("+compred+","+compgreen+","+compblue+")";
}
//cria vetor de estrelas
for(let i=0; i<numberstarts; i++){
    stars.push(new star())
}
//plota estrelas em elemento canva
function plotstars(){
    stars.forEach(st=>{
        ctxcanva.beginPath();
        ctxcanva.arc(st.x, st.y, st.size, 0, 2*Math.PI);
        ctxcanva.fillStyle = st.color;
        ctxcanva.fill();
    });
}
function plotpeso(){
    ctxcanvap.fillStyle = "#ddd";
    ctxcanvap.fillRect(0,0,pWidth,pHeight);
    ctxcanvap.drawImage(imgpeso,0,0);
    ctxcanvap.fillStyle = "#eee";
    ctxcanvap.font = "15px Arial";//configura fonte de proximo texto no contexto
    ctxcanvap.textAlign = "center";
    ctxcanvap.fillText(massa.toFixed(1)+" kg",35,70);//escreve no contexto (texto, esquerdatexto, embaixotexto)
    ctxcanvap.fillStyle = "#222";
    ctxcanvap.fillText((massa*aceleracaoCentripeta).toFixed(1)+" N",35,140);//escreve no contexto (texto, esquerdatexto, embaixotexto)
}
function plotStation(ang=0){
    const cx = (maxWidth/2);
    const cy = (maxHeight/2);
    ang = ang*Math.PI/180;
    ctxcanva.fillStyle = "#000";
    ctxcanva.fillRect(0,0,maxWidth,maxHeight);
    plotstars();
    plotpeso();
    ctxcanva.translate(cx,cy);
    ctxcanva.rotate(ang);
    ctxcanva.translate(-cx,-cy);
    ctxcanva.drawImage(imgstation,5,5,maxHeight-10, maxHeight-10);
    ctxcanva.drawImage(canvaspeso,(maxWidth/2)-(pWidth/4),(maxHeight*(0.7)),pWidth/2,pHeight/2);
    ctxcanva.translate(cx,cy);
    ctxcanva.rotate(-ang);
    ctxcanva.translate(-cx,-cy);
    ctxcanva.drawImage(imgstationc,5,5,maxHeight-10, maxHeight-10);
}
setTimeout(plotStation,200);

function calcularGravidadeArtificial(raio, velocidadeAngular) {
    // Converter a velocidade angular de RPM (rotações por minuto) para radianos por segundo
    velocidadeAngular = (velocidadeAngular * 2 * Math.PI) / 60;
    // Calcular a aceleração centrípeta
    aceleracaoCentripeta = Math.pow(velocidadeAngular, 2) * raio;
    // Calcular a gravidade artificial
    let gravidadeArtificial = aceleracaoCentripeta / gterra;
    return gravidadeArtificial;
}

inraio.addEventListener('change',()=>{
    raio = parseInt(inraio.value);
    gravidade = calcularGravidadeArtificial(raio, velocidadeAngular);
    velocidade = (velocidadeAngular*raio)/60;
    output.innerHTML = "a = "+aceleracaoCentripeta.toFixed(2)+" m/s² = "+gravidade.toFixed(2)+" g";
    outputv.innerHTML = "v = "+velocidade.toFixed(2)+" m/s = "+(velocidade*3.6).toFixed(2)+" km/h";
    plotpeso();
});
inrot.addEventListener('change',()=>{
    velocidadeAngular = parseFloat(inrot.value);
    gravidade = calcularGravidadeArtificial(raio, velocidadeAngular);
    velocidade = (velocidadeAngular*raio)/60;
    rpmtohz.innerHTML="= "+(velocidadeAngular/60).toFixed(2)+" Hz";
    output.innerHTML = "a = "+aceleracaoCentripeta.toFixed(2)+" m/s² = "+gravidade.toFixed(2)+" g";
    outputv.innerHTML = "v = "+velocidade.toFixed(2)+" m/s = "+(velocidade*3.6).toFixed(2)+" km/h";
    plotpeso();
    dang = 0.18*velocidadeAngular;//angulo a cada 30 milissegundos
    
});
inmass.addEventListener('change',()=>{
    massa = parseFloat(inmass.value);
    plotpeso();
});
startcond.addEventListener('click',()=>{
    dang = 0.18*velocidadeAngular;//angulo a cada 30 milissegundos
    clearInterval(rotation);
    rotation = setInterval(()=>{
        ang = (ang+dang)%360;
        plotStation(ang);
    },dtime);
});
pausecond.addEventListener('click',()=>{
    clearInterval(rotation);
    rotation = 0;
});
