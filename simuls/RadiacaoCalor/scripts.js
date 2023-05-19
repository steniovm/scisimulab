const canvasrad = document.getElementById('canvasrad');
const canvasgcv = document.getElementById('canvasgcv');
const startrad = document.getElementById('startrad');
const pauserad = document.getElementById('pauserad');
const linksabas = document.querySelectorAll('a');
const conteudo = document.querySelectorAll('.conteudo');
const ctxrad = canvasrad.getContext("2d");
const ctxgcv = canvasgcv.getContext("2d");
const isolant = 20;
const maxWidth = canvasrad.width;
const maxHeight = canvasrad.height;
const grapResolution = 100000;
let blocks = [];
let fotons = [];
let temperinter = {min:0, max:0, leng:0, dx:0, dy:0};
let hfq = {hf:0,hq:0};
let radparam = {
    ff:{
        temper:0,
        mass:0,
        cal:0
    },
    fq:{
        temper:0,
        mass:0,
        cal:0
    },
    coef:0
};
let intervalrad = 0;
let timerad = 0;
linksabas.forEach((item)=>{item.addEventListener('click',function(){
    document.querySelector('.initaba').classList.remove('initaba');
});});
document.querySelectorAll('input').forEach((item)=>{
    item.addEventListener('change',()=>{
        if(parseFloat(item.value) < parseFloat(item.min)) {item.value=item.min;}
        else if(parseFloat(item.value) > parseFloat(item.max)) {item.value=item.max;}
    });
});
Array.from(document.getElementsByClassName('temper')).forEach((item, index)=>{
    item.addEventListener('change',()=>{
        document.getElementsByClassName('convert')[index].innerHTML = '='+(item.value-273)+'°C='+Math.round(1.8*item.value-459.4)+"°F";
    });
});
function blackBodyRadiation(temperature) {
    const boltzmann = 5.670374419E-8; // constante de Boltzmann em W/(m^2*K^4)
    const wien = 2.897771955E-3; // constante de Wien em metros-kelvin
    //const ligthspeed = 299792458; // velocidade da luz
    const radiation = boltzmann * Math.pow(temperature, 4);
    const wavelength = (wien / temperature)*1000000000;
    //const frequency = ligthspeed/wavelength;
    return {radiation,wavelength};
}
function bodyfis(temper,mass,cal,color,x0,y0,x1,y1){
        this.ctx = ctxrad;
        this.temper = parseFloat(temper);//temperatura em K
        this.mass = mass;//massa em kg
        this.cal = cal;//calor especifico em J/kg.K (https://www.preparaenem.com/fisica/calor-especifico-uma-substancia.htm)
        this.color = color;//cor (apenas para visualização)
        this.x0 = x0;//posição do canto superior esquerdo
        this.y0 = y0;//posição do canto superior esquerdo
        this.x1 = x1;//largura
        this.y1 = y1;//altura
        this.printtext = true;
        this.direct = true;//true sobe false desce
    this.drawBlock = function (){
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(this.x0-1, this.y0-1, this.x1+2, this.y1+2);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x0, this.y0, this.x1, this.y1);
        if (this.printtext){
            this.ctx.font = "15px Arial";//configura fonte de texto no contexto
            this.ctx.fillStyle = "#000";
            this.ctx.fillText(`T = ${Math.round(this.temper*100)/100} K`,(x0+(x1*0.1)),(y0+(y1*0.6)));
        }
    }
    this.heat = function (energy){
        this.temper += energy/(this.mass*this.cal);
        this.drawBlock();
        return this.temper;
    }
    this.partic = function(){
        this.printtext = false;
        return true;
    }
    this.freezeWarm = function(energy, color, x0){
        this.color = color;
        this.x0 = x0;
        return this.heat(energy);
    }
    this.directer = function(direct){
        return this.direct = direct;
    }
    this.move = function(){
        if (this.direct){
            this.y0 -= this.y1;
        }else{
            this.y0 += this.y1;
        }
        return this.y0;
    }
}
function foton(energy,color,y0,dy,direct){
    this.ctx = ctxrad;
    this.energy = energy;//energia do foton
    this.color = color;//cor (apenas para visualização)
    this.x0 = Math.random()*(maxWidth-2.6*isolant)+(1.3*isolant);//posição do centro
    this.y0 = y0;//posição do centro
    this.dy = dy;//movimentação
    this.r = 5;//raio
    this.direct = direct;//true sobe false desce
    this.drawFoton = function (){
        this.ctx.beginPath();
        this.ctx.arc(this.x0, this.y0, this.r,0, 2*Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    this.move = function(){
        if (direct) {
            this.y0 += this.dy;
        }else{
            this.y0 -= this.dy;
        }
        this.drawFoton();
        return this.y0;
    }
}
function drawBorder(color, width, ctx,ctxg, canva,canvag){
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canva.width, canva.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(width-1, width-1, canva.width-(2*width)+2, canva.height-(2*width)+2);
    ctx.clearRect(width, width, canva.width-(2*width), canva.height-(2*width));
    ctxg.fillStyle = "#333333";
    ctxg.fillRect(0, 0, canvag.width, canvag.height);
}
drawBorder("#fafaaa",isolant,ctxrad,ctxgcv,canvasrad,canvasgcv);
function creatBlocks(param){
    let block;
    blocks = [];
    block = new bodyfis(param.ff.temper,param.ff.mass,param.ff.cal,"#99f",(isolant+1),(isolant+1),(maxWidth-(2*isolant)-2),(maxHeight*0.1));
    block.drawBlock();
    blocks.push(block);
    block = new bodyfis(param.fq.temper,param.fq.mass,param.fq.cal,"#f99",(isolant+1),((maxHeight*0.9)-isolant),(maxWidth-(2*isolant)-2),(maxHeight*0.1));
    block.drawBlock();
    blocks.push(block);
    hfq.hf = (maxHeight*0.1)+isolant;
    hfq.hq = ((maxHeight*0.9)-isolant)-(isolant/2);
}
function refreshgrad(ctx,canva){
    ctx.fillStyle = "#33333380";
    ctx.fillRect(0, 0, canva.width, canva.height);
    timerad = 0;
}
function drawgraprad(index){
    let r = ((index==0 || index==(blocks.length-1)) ? 2 : 0.5);  
    ctxgcv.beginPath();
    ctxgcv.arc(10*timerad*temperinter.dx, (canvasgcv.height-(blocks[index].temper-temperinter.min)*temperinter.dy), r, 0, 2*Math.PI);
    ctxgcv.fillStyle = blocks[index].color;
    ctxgcv.fill();
}
function blackBodyRadiation(temperature) {
    const boltzmann = 5.670374419E-8; // constante de Boltzmann em W/(m^2*K^4)
    const wien = 2.897771955E-3; // constante de Wien em metros-kelvin
    //const ligthspeed = 299792458; // velocidade da luz
    const radiation = boltzmann * Math.pow(temperature, 4);
    const wavelength = (wien / temperature)*1.0E9;// comprimento de onda em nanometros
    //const frequency = ligthspeed/wavelength;//frequencia da onda em GHz
    return {radiation,wavelength};
}
function colorfoton(wl){
    if (wl > 750){
        return "#666";
    }else if (wl < 400){
        return "#fff";
    }else{
        return `hsl(${Math.round(((350-(wl-400))/350)*270)},100%,50%)`;
    }
}
function animation(){
    if (!intervalrad){
        intervalrad = setInterval(function(){
            let yy;
            let newfoton;
            let ftpr;
            ctxrad.clearRect(isolant, isolant, canvasrad.width-(2*isolant), canvasrad.height-(2*isolant));
            blocks[0].drawBlock();
            ftpr = blackBodyRadiation(blocks[0].temper);
            newfoton = new foton(((ftpr.radiation)/10000),colorfoton(ftpr.wavelength),hfq.hf,100*(temperinter.dy),true);
            blocks[0].heat(-newfoton.energy);
            newfoton.drawFoton();
            fotons.push(newfoton);
            blocks[1].drawBlock();
            ftpr = blackBodyRadiation(blocks[1].temper);
            newfoton = new foton(((ftpr.radiation)/10000),colorfoton(ftpr.wavelength),hfq.hq,100*(temperinter.dy),false);
            blocks[1].heat(-newfoton.energy);
            newfoton.drawFoton();
            fotons.push(newfoton);
            timerad++;
            for(let i=0; i<fotons.length; i++){
                yy = fotons[i].move();
                if (yy<hfq.hf){
                    blocks[0].heat(fotons[i].energy);
                    fotons.splice(i,1);
                }else if (yy>hfq.hq){
                    blocks[1].heat(fotons[i].energy);
                    fotons.splice(i,1);
                }
            }
            blocks[0].drawBlock();
            blocks[1].drawBlock();
            if(timerad >= (grapResolution/10)) {
                refreshgrad(ctxgcv,canvasgcv);
            }
            drawgraprad(0);
            drawgraprad(1);
            if(Math.abs(blocks[0].temper-blocks[1].temper)<0.01) {
                clearInterval(intervalrad);
                intervalrad = 0;
                timerad = 0;
            }
        },50);
    }
} 
startrad.addEventListener('click',function(){
    pauserad.innerHTML = "Parar";
    clearInterval(intervalrad);
    intervalrad = 0;
    refreshgrad(ctxgcv,canvasgcv);
    radparam = {
        ff:{
            temper: document.getElementById('TFi').value,
            mass: document.getElementById('MFi').value,
            cal: document.getElementById('CFi').value
        },
        fq:{
            temper: document.getElementById('TQi').value,
            mass: document.getElementById('MQi').value,
            cal: document.getElementById('CQi').value
        },
        coef: 1
    };
    creatBlocks(radparam);
    temperinter.min = blocks[0].temper;
    temperinter.max = blocks[0].temper;
    for(let i=1; i<blocks.length; i++){
        if (blocks[i].temper < temperinter.min) temperinter.min = blocks[i].temper;
        if (blocks[i].temper > temperinter.max) temperinter.max = blocks[i].temper;
    }
    temperinter.leng = temperinter.max - temperinter.min;
    temperinter.dx = canvasgcv.width/grapResolution;
    temperinter.dy = (canvasgcv.height)/(temperinter.leng);
    animation();
});
pauserad.addEventListener('click',function(){
    if(intervalrad){
        clearInterval(intervalrad);
        intervalrad = 0;
        pauserad.innerHTML = "Continuar";
    }else{
        animation();
        pauserad.innerHTML = "Parar";
    }
});