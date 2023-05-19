const LIMITS = {top:0,left:0,down:92,right:88,downb:96,rightb:94,gleft:35,gright:57};
const VELOCOM = 0.5;
const screen = document.querySelector('html');
const mainbox = document.querySelector('main');
const gircell = document.getElementById('gircell');
const gamerconfig = document.getElementById('gamerconfig');
const alga = document.getElementsByName('alga');
const dire = document.getElementsByName('dire');
const inTime = document.getElementById('inTime');
const ltime = document.getElementById('ltime');
const celltim = document.getElementById('celltim');
const inVel = document.getElementById('inVel');
const Vmusic = document.getElementById('Vmusic');
const Vefect = document.getElementById('Vefect');
const Iniciar = document.getElementById('Iniciar');
const bRestart = document.getElementById('bRestart');
const Saveps = document.getElementById('Saveps');
const ballgame = document.querySelector('.ballgame');
const cabec = document.querySelectorAll('.cabec');
const algar = document.querySelectorAll('.algar');
const cellbox = document.querySelectorAll('.cellbox');
const touchbox = document.getElementById('touchbox');
const celldir = document.querySelectorAll('.celldir');
const cellgir = document.querySelectorAll('.cellgir');
const cellnum = document.querySelectorAll('.cellnum');
const playactiv = document.getElementById('playactiv');
const arrow = document.getElementById('arrow');
const plc = document.getElementById('plc');
const pla = document.getElementById('pla');
const cellplc = document.getElementById('cellplc');
const cellexitfs = document.getElementById('cellexitfs');
const music = new Audio("./assets/jigsaw-puzzle-background.mp3");
music.loop = true;
const apitosong = new Audio("./assets/apitodefutebol.mp3");
const oversong = new Audio("./assets/defeat-sound.mp3");
const winssong = new Audio("./assets/applause_bbc.mp3");
const goalsong = new Audio("./assets/goool.mp3");
let positions = {
    ball:{x:0,y:0},
    cabec:[{x:0,y:0}],
    algar:[{x:0,y:0}]
};
let bollvec = {dx:0,dy:0};
let printok = false;
let gameplay = false;
let playac = undefined;
let direc = 0;
let timergame = 0;
let config = {
    valga:0,
    vdire:0,
    timeg:0,
    veloc:0,
    vmusi:0,
    vefec:0
};
let direcbt={up:"",left:"",down:"",right:""};
let placar=[0,0];
let finterval = undefined;
let ginterval = undefined;
let dirinterval = undefined;
let girinterval = undefined;
let numinterval = undefined;
let ismobile = undefined;

//funções
//carrega as configurações
function upconfig(){
    alga.forEach(function(item,index){
        if (item.checked){
            config.valga = index;
        }
    });
    dire.forEach(function(item,index){
        if (item.checked){
            config.vdire = index;
        }
    });
    config.timeg = inTime.value;
    config.veloc = inVel.value;
    config.vmusi = Vmusic.value;
    config.vefec = Vefect.value;
    music.volume = config.vmusi;
    apitosong.volume = config.vefec;
    oversong.volume = config.vefec;
    winssong.volume = config.vefec;
    goalsong.volume = config.vefec;
    if (printok) console.log(config);
}
//salva configurações em cookie
function saveconf(){
    const d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = 'numberball' + "=" + JSON.stringify(config) + ";" + expires + ";path=/";
    console.log('save cookie: '+'numberball' + "=" + JSON.stringify(config) + ";" + expires + ";path=/");
}
//renderiza os jogadores nas suas posições atuais em campo
function showplayers(){
    ballgame.style.top = positions.ball.y+'%';
    ballgame.style.left = positions.ball.x+'%';
    for (let i=0; i<10; i++){
        cabec[i].style.top = positions.cabec[i].y+'%';
        cabec[i].style.left = positions.cabec[i].x+'%';
        algar[i].style.top = positions.algar[i].y+'%';
        algar[i].style.left = positions.algar[i].x+'%';
    }
    if (playac){
        arrow.style.top = (positions.algar[playac].y-2)+'%';
        arrow.style.left = (positions.algar[playac].x-2)+'%';
    }
}
//sorteia a posição atual de cada jogador em campo
function positioninit(){
    positions.ball = {x:47,y:48};
    positions.cabec[0] = {x:44,y:2};
    positions.algar[0] = {x:44,y:90};
    for (let i=1;i<10;i++) {
        let cy = Math.random()*42;
        let cx = Math.random()*LIMITS.right;
        let ny = Math.random()*42+50;
        let nx = Math.random()*LIMITS.right;
        positions.cabec.push({x:cx,y:cy});
        positions.algar.push({x:nx,y:ny});
    }
    showplayers();
    if (printok) console.log(positions);
}
//renderiza os numeros dos jogadores conforme escolha dos algarismos
function shownambers(){
    for (let i=0;i<10;i++){
        algar[i].src="./assets/"+alga[config.valga].value+i+".svg";
    }
}
//configura botões direcionais conforme configurado
function direcbtdef(){
    if (config.vdire==0){
        direcbt.up = "ArrowUp";
        direcbt.left = "ArrowLeft";
        direcbt.down = "ArrowDown";
        direcbt.right = "ArrowRight";
    }else if (config.vdire==1){
        direcbt.up = "w";
        direcbt.left = "a";
        direcbt.down = "s";
        direcbt.right = "d";
    }else if (config.vdire==2){
        touchbox.style.display = "flex";
        mainbox.style.display = "none";
        gircell.style.display = "flex";
        setTimeout(function(){gircell.style.display = "none"},3000);

    }
}
//move jogador selecionado
function moveplayarrow(ar){
    switch(ar){
        case 0:
            if (playac && positions.algar[playac].y>LIMITS.top){
                positions.algar[playac].y -= 2;
            }
        break;
        case 1:
            if (playac && positions.algar[playac].x>LIMITS.left){
                positions.algar[playac].x -= 2;
            }
        break;
        case 2:
            if (playac && positions.algar[playac].x<LIMITS.right){
                positions.algar[playac].x += 2;
            }
        break;
        case 3:
            if (playac && positions.algar[playac].y<LIMITS.down){
                positions.algar[playac].y += 2;
            }
        break;
    }
}
//gira a direção do chute: 0-esquerda 1-direita
function girarrow(se){
    if (se==0){
        if (direc > -90) {
            direc -= 5;
            arrow.style.transform = "rotate("+direc+"deg)";
        }
    }else if (se==1){
        if (direc < 90) {
            direc += 5;
            arrow.style.transform = "rotate("+direc+"deg)";
        }
    }
}
//seleciona o jogador controlado
function numselect(cr){
    if (playac) algar[playac].classList.toggle('enf');
    playac = cr;
    playactiv.innerHTML = cr;
    algar[playac].classList.toggle('enf');
}
//marca o gol. parametro: 0-cabeçudos 1-algarismos
function newgool(team){
    placar[team]++; //
    plc.innerHTML = placar[0];
    pla.innerHTML = placar[1];
    cellplc.innerHTML = placar[0]+'X'+placar[1];
    positions.ball = {x:47,y:48};
    goalsong.play();
    showplayers();
}
//executa a partida dentro do tempo
async function playing(){
    if (gameplay){
        let dx;
        let dy;
        apitosong.play();
        setTimeout(function(){
            music.play();
        },1000);
        //movimentos
        finterval = setInterval(function(){
            //detecta colisão bola parede lateral
            if (positions.ball.x < LIMITS.left || positions.ball.x > LIMITS.rightb){
                bollvec.dx *= -1;
            }
            //detecta colisão bola parede de gol
            if (positions.ball.y < LIMITS.top || positions.ball.y > LIMITS.downb){
                //detecta se foi gol
                if (positions.ball.x >= LIMITS.gleft && positions.ball.x <= LIMITS.gright){
                    if (positions.ball.y <= LIMITS.top) newgool(1);
                    if (positions.ball.y >= LIMITS.downb) newgool(0);
                }else{
                    bollvec.dy *= -1;
                }
            }
            //detecta colisão bola jogador
            for (let i=0;i<10;i++){
                let ddx = (positions.ball.x+2)-(positions.cabec[i].x+4);
                let ddy = (positions.ball.y+2)-(positions.cabec[i].y+4);
                let dd = Math.sqrt(Math.pow(ddx,2)+Math.pow(ddy,2));
                if (dd<=6){
                    bollvec.dy = VELOCOM;
                    if (bollvec.dx >=0) {bollvec.dx = VELOCOM;}
                    else {bollvec.dx = -VELOCOM;}
                }
                ddx = (positions.ball.x)-(positions.algar[i].x)-4;
                ddy = (positions.ball.y)-(positions.algar[i].y)-4;
                dd = Math.sqrt(Math.pow(ddx,2)+Math.pow(ddy,2));
                if (dd<=8){
                    if (i!=playac){
                        bollvec.dy = -VELOCOM;
                        if (bollvec.dx >=0) {bollvec.dx = VELOCOM;}
                        else {bollvec.dx = -VELOCOM;}
                    }else{
                        bollvec.dy = -(2*VELOCOM*Math.cos(direc*(Math.PI/180)));
                        bollvec.dx = (2*VELOCOM*Math.sin(direc*(Math.PI/180)));
                    }
                }
            }
            //move a bola
            positions.ball.x += bollvec.dx;
            positions.ball.y += bollvec.dy;
            //move jogadores aleatóriamente (movimento browniano) exceto jogador selecionado
            for (let i=0; i<10; i++){
               dx = Math.random()*2-1;
               dy = Math.random()*2-1;
               if (positions.cabec[i].x + dx >= LIMITS.left && positions.cabec[i].x + dx <= LIMITS.right ){
                positions.cabec[i].x += dx;
               }
               if (positions.cabec[i].y + dy >= LIMITS.top && positions.cabec[i].y + dy <= LIMITS.down ){
                positions.cabec[i].y += dy;
               }
               if (playac && i!=playac){
                if (positions.algar[i].x + dx >= LIMITS.left && positions.algar[i].x + dx <= LIMITS.right ){
                    positions.algar[i].x += dx;
                }
                if (positions.algar[i].y + dy >= LIMITS.top && positions.algar[i].y + dy <= LIMITS.down ){
                    positions.algar[i].y += dy;
                }
               } 
            }
            //atualiza posição dos jogadores
            showplayers();
        },100*(1.1-config.veloc));//timer conforme velocidade configurada
        //tempo de jogo
        ginterval = setInterval(function(){
            if (timergame<config.timeg){
                timergame += 0.1;
                ltime.innerHTML = Math.round(timergame*10)/10;
                celltim.innerHTML = Math.round(timergame*10)/10;
            }else{
                gameplay = false;
                music.pause();
                if (placar[1]>placar[0]) {
                    winssong.play();
                }else{
                    oversong.play();
                }
                clearInterval(finterval);
                clearInterval(ginterval);
                document.exitFullscreen()
                touchbox.style.display = "none";
                mainbox.style.display = "unset";
            }
        },100);
    }
}
function enterfullscreem(){
    if (screen.requestFullscreen){
        screen.requestFullscreen();
    }
    else if (screen.msRequestFullscreen){
        screen.msRequestFullscreen();
    }
    else if (screen.mozRequestFullScreen){
        screen.mozRequestFullScreen();
    }
}

//script inicial
//resgata configurações salvas em cookie
ismobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4));
if (ismobile) dire[2].checked = true;
if (document.cookie.indexOf('numberball')>=0){
    config = JSON.parse(document.cookie.split("; ").find((row) => row.startsWith('numberball='))?.split("=")[1])
    upconfig();
}
//inicializa posição dos jogadores em campo
positioninit();

//eventos
//botão iniciar
Iniciar.addEventListener('click',function(){
    upconfig();
    shownambers();
    direcbtdef();
    gamerconfig.style.display = 'none';
    gameplay = true;
    playing();
    enterfullscreem();
    untouch();
});
//botão salvar configurações
Saveps.addEventListener('click',function(){
    upconfig();
    saveconf();
});
//botão reiniciar jogo volta para tela de configurações
bRestart.addEventListener('click',function(){
    gameplay = false;
    gamerconfig.style.display = 'flex';
    touchbox.style.display = "none";
    mainbox.style.display = "unset";
    music.pause();
    timergame = 0;
    playac = undefined;
    clearInterval(finterval);
    clearInterval(ginterval);
    positions = {
        ball:{x:0,y:0},
        cabec:[{x:0,y:0}],
        algar:[{x:0,y:0}]
    };
    positioninit();
    document.exitFullscreen();
});
//pressionar teclas
document.addEventListener('keydown',function(e){
    //ação somente se jogo iniciado
    if (gameplay){
        const key = e.key;
        console.log(key)
        switch (key){
            //se digita um numero seleciona um jogador em campo
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                numselect(Number.parseInt(key));
            break;
            //se direcional move o jogador selecionado
            case direcbt.left:
            case direcbt.left.toUpperCase():
                moveplayarrow(1);
            break;
            case direcbt.right:
            case direcbt.right.toUpperCase():
                moveplayarrow(2);
            break;
            case direcbt.up:
            case direcbt.up.toUpperCase():
                moveplayarrow(0);
            break;
            case direcbt.down:
            case direcbt.down.toUpperCase():
                moveplayarrow(3);
            break;
            //se < ou > rotaciona o vetor do chute
            case "<":
            case ",":
                girarrow(0);
            break;
            case ">":
            case ".":
                girarrow(1);
            break;
        }
    }
});
celldir.forEach(function(item,index){
    item.addEventListener('pointerdown',function(){
        dirinterval = setInterval(function(){
            moveplayarrow(index);
        },50);
    });
    item.addEventListener('pointerup',function(){
        clearInterval(dirinterval);
    });
});
cellgir.forEach(function(item,index){
    item.addEventListener('pointerdown',function(){
        girinterval = setInterval(function(){
            girarrow(index);
        },50);    
    });
    item.addEventListener('pointerup',function(){
        clearInterval(girinterval);
    });
});
cellnum.forEach(function(item,index){
    item.addEventListener('pointerdown',function(){
        numinterval = setInterval(function(){
            numselect(index+1);
        },50);
    });
    item.addEventListener('pointerup',function(){
        clearInterval(numinterval);
    });
});
cellexitfs.addEventListener('pointerdown',function(){
    document.exitFullscreen();
});
function untouch() {
    touchbox.addEventListener("touchstart", onTouch, false);
    touchbox.addEventListener("touchend", onTouch, false);
    touchbox.addEventListener("touchcancel", onTouch, false);
    touchbox.addEventListener("touchleave", onTouch, false);
    touchbox.addEventListener("touchmove", onTouch, false);
  }
function onTouch(evt) {
    evt.preventDefault();
    if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
      return;
}
