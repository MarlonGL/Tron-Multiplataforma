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
            sock.emit('xy', cauda[cauda.length - 1]);
            
            console.log(id);
        }
        else if(id == 2) {
            px = 70;
            py = 25;
            cauda[0] = { x: px, y: py };
            ctx.fillStyle = "lime";
            ctx.fillRect(cauda[0].x * gs, cauda[0].y * gs, gs - 2, gs - 2);
            sock.emit('xy', cauda[cauda.length - 1]);

            console.log(id);
        }
    })
    

    sock.on('comece', (com) => {
        if(id == 1)
        {
            xv = 1; yv = 0;
            comecou = true;
        }
        else if (id == 2) {
            xv = -1; yv = 0;
            comecou = true;
        }
    })

    sock.on('xy',desenharInimigo);

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
        //ctx.fillRect(px*gs,py*gs, gs-2,gs-2);
        for (var i = 0; i < cauda.length; i++) {
            ctx.fillRect(cauda[i].x * gs, cauda[i].y * gs, gs - 2, gs - 2);
            //console.log(cauda[i].x, cauda[i].y);
           /* if(cauda[i].x == cauda[cauda.length - 1].x && cauda[i].y == cauda[cauda.length - 1].y) {
                perdeu = true;
            }*/
        }
       /* if(cauda[cauda.length - 1].x * gs == inimigo[inimigo.length - 1].x * gs 
            && cauda[cauda.length - 1]. y * gs == inimigo[inimigo.length - 1].y * gs) {
                perdeu = true;
            }*/


    }
    
    
    
}

function desenharInimigo(data) {
    inimigo.push(data);
    ctx.fillStyle = "tomato";
    ctx.fillRect(data.x * gs, data.y * gs, gs - 2, gs - 2);
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