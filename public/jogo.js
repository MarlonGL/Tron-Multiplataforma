var canvas;
var ctx;
var xv = 0, yv = 0;    // velocidade x e y
var px = 10, py = 10;  //player x e y
var gs = 10, tc = 10; //grid , tile
var cauda = [{x:px,y:py}];
var inimigo = [];
var comecou = false;
var perdeu = false;
var sock = io();
var id = null;

var pontos = 0;
var pontos2 = 0;
window.onload = function() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    sock.on('id', (idR) => {
        id = idR;
        if(id == 1) {
            px = 10;
            py = 25;
            cauda[0] = { x: px, y: py };
            ctx.fillStyle = "lime";
            ctx.fillRect(cauda[0].x * gs, cauda[0].y * gs, gs - 2, gs - 2);
            
            console.log(id);
        }
        else if(id == 2) {
            px = 70;
            py = 25;
            cauda[0] = { x: px, y: py };
            ctx.fillStyle = "lime";
            ctx.fillRect(cauda[0].x * gs, cauda[0].y * gs, gs - 2, gs - 2);

            console.log(id);
        }
    })
    

    sock.on('comece', (com, p1, p2) => {
        if(id == 1)
        {
            pontos = p1;
            xv = 1; yv = 0;
            comecou = true;
            sock.emit('xy', cauda[cauda.length - 1]);
        }
        else if (id == 2) {
            pontos2 = p2;
            xv = -1; yv = 0;
            comecou = true;
            sock.emit('xy', cauda[cauda.length - 1]);
        }
    })

    sock.on('xy',desenharInimigo);

    sock.on('pontos',(p1, p2) => {
        if(id == 1) {
            perdeu = true;
            pontos = p1;
            pontos2 = p2;
            console.log('Player 1 tem: ' + pontos + ' Player 2 tem: ' + pontos2);
        }else if(id == 2) {
            perdeu = true;
            pontos2 = p2;
            pontos = p1;
            console.log('Player 1 tem: ' + pontos + ' Player 2 tem: ' + pontos2);
        }
    })

    document.addEventListener("keydown", teclado);
    this.setInterval(game, 1000 / 15);
    
}
function game() {
    if(comecou == true && id != null && !perdeu) {
        px += xv;
        py += yv;
        cauda.push({ x: px, y: py });
        
        sock.emit('xy', cauda[cauda.length - 1]);
        ctx.fillStyle = "lime";
        ctx.fillRect(cauda[cauda.length - 1].x * gs, cauda[cauda.length - 1].y * gs, gs - 2, gs - 2);

        //colisao paredes
        testarColisaoParedes();

        //colisao com ele mesmo
        if(cauda.length > 5)
        {
            for (var i = 0; i < cauda.length -1; i++) {
                testarColisao(i);
            }
        }
        //colisao com o inimigo
        for (var i = 0; i < inimigo.length; i++) {
            testarColisaoInimigo(i);
        }
       


    }
}

function testarColisao(index) {
    if(cauda[cauda.length - 1].x * gs == cauda[index].x * gs
        && cauda[cauda.length - 1]. y * gs == cauda[index].y * gs) {
            perdeu = true;
            console.log('colidiu consigo');
        }
}

function testarColisaoInimigo(index) {
    if(cauda[cauda.length - 1].x * gs == inimigo[index].x * gs
        && cauda[cauda.length - 1]. y * gs == inimigo[index].y * gs) {
            if(index == inimigo.length -1)
            {
                perdeu = true;
                console.log('empate')
            }
            perdeu = true;
            console.log('colidiu inimigo');
        }
}

function testarColisaoParedes(){
    if(cauda[cauda.length - 1].x *gs == canvas.width) {
        perdeu = true;
        console.log('parede');
        sock.emit('perdi', id);
    } else if(cauda[cauda.length - 1].x *gs == 0){
        perdeu = true;
        console.log('parede');
        sock.emit('perdi', id);
    }else if(cauda[cauda.length - 1]. y * gs == canvas.height) {
        perdeu = true;
        console.log('parede');
        sock.emit('perdi', id);
    } else if(cauda[cauda.length - 1]. y * gs == 0){
        perdeu = true;
        console.log('parede');
        sock.emit('perdi', id);
    }   
}

function desenharInimigo(data) {
    inimigo.push(data);
    ctx.fillStyle = "tomato";
    ctx.fillRect(inimigo[inimigo.length -1].x * gs, inimigo[inimigo.length -1].y * gs, gs - 2, gs - 2);
}

function teclado(evt) {
    if (comecou == true) {
        if (evt.keyCode == 37) {
            xv = -1; yv = 0;
        }
        if (evt.keyCode == 38) {
            xv = 0; yv = -1;
        }
        if (evt.keyCode == 39) {
            xv = 1; yv = 0;
        }
        if (evt.keyCode == 40) {
            xv = 0; yv = 1;
        }
    }
}