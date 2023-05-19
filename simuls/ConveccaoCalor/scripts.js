const canvasconv = document.getElementById('canvasconv');
const canvasgcv = document.getElementById('canvasgcv');
const startconv = document.getElementById('startconv');
const pauseconv = document.getElementById('pauseconv');
const linksabas = document.querySelectorAll('a');
const conteudo = document.querySelectorAll('.conteudo');
const ctxconv = canvasconv.getContext("2d");
const ctxgcv = canvasgcv.getContext("2d");
const isolant = 20;
const maxWidth = canvasconv.width;
const maxHeight = canvasconv.height;
const grapResolution = 100000;
let blocks = [];
let temperinter = {min:0, max:0, leng:0, dx:0, dy:0};
let hfq = {hf:0,hq:0};
let convparam = {
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
    barra:{
        temper:0,
        mass:0,
        cal:0
    },
    coef:0,
    nblocks:0
};
let intervalconv = 0;
let timeconv = 0;
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

function bodyfis(temper,mass,cal,color,x0,y0,x1,y1){
        this.ctx = ctxconv;
        this.temper = parseFloat(temper);//temperatura em K
        this.mass = mass;//massa em kg
        this.cal = cal;//calor especifico em J/kg.K
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
function drawBorder(color, width, ctx,ctxg, canva,canvag){
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canva.width, canva.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(width-1, width-1, canva.width-(2*width)+2, canva.height-(2*width)+2);
    ctx.clearRect(width, width, canva.width-(2*width), canva.height-(2*width));
    ctxg.fillStyle = "#333333";
    ctxg.fillRect(0, 0, canvag.width, canvag.height);
}
drawBorder("#fafaaa",isolant,ctxconv,ctxgcv,canvasconv,canvasgcv);
function creatBlocks(param){
    let bHeight = ((maxHeight*0.8)-(2*isolant))/(param.nblocks-2);
    let x0, y0;
    blocks = [];
    for(let i=0; i<param.nblocks; i++){
        let block;
        if (i===0){
            block = new bodyfis(param.ff.temper,param.ff.mass,param.ff.cal,"#99f",(isolant+1),(isolant+1),(maxWidth-(2*isolant)-2),(maxHeight*0.1));
            hfq.hf = (maxHeight*0.1)+isolant;
        }else if(i===(param.nblocks-1)){
            block = new bodyfis(param.fq.temper,param.fq.mass,param.fq.cal,"#f99",(isolant+1),((maxHeight*0.9)-isolant),(maxWidth-(2*isolant)-2),(maxHeight*0.1));
            hfq.hq = ((maxHeight*0.9)-isolant)-(isolant/2);
        }else{
            if ((i+1)<((param.nblocks)/2)){
                y0 = 2*bHeight*(i)+3*isolant;
            }else{
                y0 = 2*bHeight*(i)+3*isolant-(maxHeight*0.7);
            }
            x0 = Math.random()*(maxWidth-2.5*isolant)+isolant;
            block = new bodyfis(param.barra.temper,(param.barra.mass/(param.nblocks-2)),param.barra.cal,"#FF9",x0,y0,(isolant/2),(isolant/2));
            block.partic();
            if ((i+1)<((param.nblocks)/2)){
                block.directer(false);
            }else{
                block.directer(true);
            }
        }
        block.drawBlock();
        blocks.push(block);
    }
}
function refreshgconv(ctx,canva){
    ctx.fillStyle = "#33333380";
    ctx.fillRect(0, 0, canva.width, canva.height);
    timeconv = 0;
}
function drawgrapconv(index){
    let r = ((index==0 || index==(blocks.length-1)) ? 2 : 0.5);  
    ctxgcv.beginPath();
    ctxgcv.arc(timeconv*temperinter.dx, (canvasgcv.height-(blocks[index].temper-temperinter.min)*temperinter.dy), r, 0, 2*Math.PI);
    ctxgcv.fillStyle = blocks[index].color;
    ctxgcv.fill();
}
function animation(){
    if (!intervalconv){
        intervalconv = setInterval(function(){
            let tx;
            let yy;
            let xx;
            ctxconv.clearRect(isolant, isolant, canvasconv.width-(2*isolant), canvasconv.height-(2*isolant));
            for(let i=1; i<(convparam.nblocks-1); i++){
                yy = blocks[i].move();
                xx = Math.random()*((maxWidth/2)-1.5*isolant)
                if (yy <= hfq.hf){
                    tx = convparam.coef*(blocks[0].temper-blocks[i].temper);
                    blocks[i].freezeWarm(tx,blocks[0].color,(xx+isolant));
                    blocks[0].heat(-tx);
                    blocks[i].directer(false);
                }else if (yy >= hfq.hq){
                    tx = convparam.coef*(blocks[blocks.length-1].temper-blocks[i].temper);
                    blocks[i].freezeWarm(tx,blocks[blocks.length-1].color,(xx+(maxWidth/2)));
                    blocks[blocks.length-1].heat(-tx);
                    blocks[i].directer(true);
                }
            }
            for(let i=0; i<convparam.nblocks; i++) {
                blocks[i].drawBlock();
                timeconv++;
                //if (i===0 || i===(convparam.nblocks-1)) {
                    if(timeconv >= grapResolution) {
                        refreshgconv(ctxgcv,canvasgcv);
                    }
                    drawgrapconv(i);
                //}
            }
            if(Math.abs(blocks[0].temper-blocks[convparam.nblocks-1].temper)<0.01) {
                clearInterval(intervalconv);
                intervalconv = 0;
                timeconv = 0;
            }
        },50);
    }
}
startconv.addEventListener('click',function(){
    pauseconv.innerHTML = "Parar";
    clearInterval(intervalconv);
    intervalconv = 0;
    refreshgconv(ctxgcv,canvasgcv);
    convparam = {
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
        barra:{
            temper: document.getElementById('TBi').value,
            mass: document.getElementById('MBi').value,
            cal: document.getElementById('CBi').value
        },
        coef: document.getElementById('coef').value,
        nblocks: document.getElementById('ndiv').value
    };
    creatBlocks(convparam);
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
pauseconv.addEventListener('click',function(){
    if(intervalconv){
        clearInterval(intervalconv);
        intervalconv = 0;
        pauseconv.innerHTML = "Continuar";
    }else{
        animation();
        pauseconv.innerHTML = "Parar";
    }
});