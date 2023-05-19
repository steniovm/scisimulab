const canvascond = document.getElementById('canvascond');
const canvasgcd = document.getElementById('canvasgcd');
const startcond = document.getElementById('startcond');
const pausecond = document.getElementById('pausecond');
const linksabas = document.querySelectorAll('a');
const conteudo = document.querySelectorAll('.conteudo');
const ctxcond = canvascond.getContext("2d");
const ctxgcd = canvasgcd.getContext("2d");
const isolant = 20;
const maxWidth = canvascond.width;
const maxHeight = canvascond.height;
const grapResolution = 100000;
let blocks = [];
let temperinter = {min:0, max:0, leng:0, dx:0, dy:0};
let condparam = {
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
let intervalcond = 0;
let timecond = 0;
linksabas.forEach((item)=>{item.addEventListener('click',function(){
    document.querySelector('.initaba').classList.remove('initaba');
});});
Array.from(document.getElementsByClassName('temper')).forEach((item, index)=>{
    item.addEventListener('change',()=>{
        document.getElementsByClassName('convert')[index].innerHTML = '='+(item.value-273)+'°C='+Math.round(1.8*item.value-459.4)+"°F";
    });
});

function bodyfis(temper,mass,cal,color,x0,y0,x1,y1){
        this.ctx = ctxcond;
        this.temper = parseFloat(temper);//temperatura em K
        this.mass = mass;//massa em kg
        this.cal = cal;//calor especifico em J/kg.K
        this.color = color;//cor (apenas para visualização)
        this.x0 = x0;//posição do canto superior esquerdo
        this.y0 = y0;//posição do canto superior esquerdo
        this.x1 = x1;//largura
        this.y1 = y1;//altura
    this.drawBlock = function (){
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(this.x0-1, this.y0-1, this.x1+2, this.y1+2);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x0, this.y0, this.x1, this.y1);
        this.ctx.font = "15px Arial";//configura fonte de texto no contexto
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(`T = ${Math.round(this.temper*100)/100} K`,(x0+(x1*0.1)),(y0+(y1*0.6)));
    }
    this.heat = function (energy){
        this.temper += energy/(this.mass*this.cal);
        this.drawBlock();
        return this.temper;
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
drawBorder("#fafaaa",isolant,ctxcond,ctxgcd,canvascond,canvasgcd);
function creatBlocks(param){
    let bHeight = ((maxHeight*0.8)-(2*isolant))/(param.nblocks-2);
    blocks = [];
    for(let i=0; i<param.nblocks; i++){
        let block;
        if (i===0){
            block = new bodyfis(param.ff.temper,param.ff.mass,param.ff.cal,"#99f",(isolant+1),(isolant+1),(maxWidth-(2*isolant)-2),(maxHeight*0.1));
        }else if(i===(param.nblocks-1)){
            block = new bodyfis(param.fq.temper,param.fq.mass,param.fq.cal,"#f99",(isolant+1),((maxHeight*0.9)-isolant),(maxWidth-(2*isolant)-2),(maxHeight*0.1));
        }else{
            block = new bodyfis(param.barra.temper,(param.barra.mass/(param.nblocks-2)),param.barra.cal,"#ff9",((maxWidth/2)-(4*isolant)),(isolant+3+(maxHeight*0.1)+(i-1)*bHeight),(8*isolant),bHeight);
        }
        block.drawBlock();
        blocks.push(block);
    }
}
function refreshgcond(ctx,canva){
    ctx.fillStyle = "#33333380";
    ctx.fillRect(0, 0, canva.width, canva.height);
    timecond = 0;
}
function drawgrapcond(index){
    let r = ((index==0 || index==(blocks.length-1)) ? 2 : 0.5);  
    ctxgcd.beginPath();
    ctxgcd.arc(timecond*temperinter.dx, (canvasgcd.height-(blocks[index].temper-temperinter.min)*temperinter.dy), r, 0, 2*Math.PI);
    ctxgcd.fillStyle = blocks[index].color;
    ctxgcd.fill();
}
function animation(){
    if (!intervalcond){
        intervalcond = setInterval(function(){
            let tx;
            ctxcond.clearRect(isolant, isolant, canvascond.width-(2*isolant), canvascond.height-(2*isolant));
            for(let i=1; i<condparam.nblocks; i++){
                tx = condparam.coef*(blocks[i-1].temper-blocks[i].temper);
                blocks[i-1].heat(-tx);
                blocks[i].heat(tx);
            }
            for(let i=0; i<condparam.nblocks; i++) {
                blocks[i].drawBlock();
                timecond++;
                if(timecond >= grapResolution) {
                    refreshgcond(ctxgcd,canvasgcd);
                }
                drawgrapcond(i);
            }
            if(Math.abs(blocks[0].temper-blocks[condparam.nblocks-1].temper)<0.004) {
                clearInterval(intervalcond);
                intervalcond = 0;
                timecond = 0;
            }
        },1);
    }
}
startcond.addEventListener('click',function(){
    pausecond.innerHTML = "Parar";
    clearInterval(intervalcond);
    intervalcond = 0;
    refreshgcond(ctxgcd,canvasgcd);
    condparam = {
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
    creatBlocks(condparam);
    temperinter.min = blocks[0].temper;
    temperinter.max = blocks[0].temper;
    for(let i=1; i<blocks.length; i++){
        if (blocks[i].temper < temperinter.min) temperinter.min = blocks[i].temper;
        if (blocks[i].temper > temperinter.max) temperinter.max = blocks[i].temper;
    }
    temperinter.leng = temperinter.max - temperinter.min;
    temperinter.dx = canvasgcd.width/grapResolution;
    temperinter.dy = (canvasgcd.height)/(temperinter.leng);
    animation();
});
pausecond.addEventListener('click',function(){
    if(intervalcond){
        clearInterval(intervalcond);
        intervalcond = 0;
        pausecond.innerHTML = "Continuar";
    }else{
        animation();
        pausecond.innerHTML = "Parar";
    }
});