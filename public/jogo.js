var canvas;
var ctx;
var xv = 0, yv = 0;    // velocidade x e y
var px = 10, py = 10;  //player x e y
var gs = 10, tc = 10; //grid , tile
var cauda = [{x:px,y:py}];
var inimigo = [];
var comecou = false;
var perdeu = false;
var fim = false;
var sock = io();
var id = null;

var pontos = 0;
var pontos2 = 0;
window.onload = function() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext("2d");
    

    sock.on('id', (idR) => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvas.width, 80);
        perdeu = false;
        if(id == null)
        {
            id = idR;
        }
        if(id == 1) {
            px = 10;
            py = 40;
            cauda[0] = { x: px, y: py };
            ctx.fillStyle = "lime";
            ctx.fillRect(cauda[0].x * gs, cauda[0].y * gs, gs - 2, gs - 2);
            
            console.log(id);
        }
        else if(id == 2) {
            px = 70;
            py = 40;
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
            pontos2 = p2;
            desenharPontos();
            xv = 1; yv = 0;
            comecou = true;
            sock.emit('xy', cauda[cauda.length - 1]);
        }
        else if (id == 2) {
            pontos2 = p2;
            pontos = p1;
            desenharPontos();
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
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            desenharPontos();
            px = 10;
            py = 40;
            cauda = [];
            inimigo = [];
            cauda[0] = { x: px, y: py };
            xv = 1; yv = 0;
            comecou = true;
            perdeu = false;
            ctx.fillStyle = "lime";
            ctx.fillRect(cauda[0].x * gs, cauda[0].y * gs, gs - 2, gs - 2);
            sock.emit('xy', cauda[cauda.length - 1]);
        }else if(id == 2) {
            perdeu = true;
            pontos2 = p2;
            pontos = p1;
            console.log('Player 1 tem: ' + pontos + ' Player 2 tem: ' + pontos2);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            desenharPontos();
            px = 70;
            py = 40;
            cauda = [];
            inimigo = [];
            cauda[0] = { x: px, y: py };
            xv = -1; yv = 0;
            comecou = true;
            perdeu = false;
            ctx.fillStyle = "lime";
            ctx.fillRect(cauda[0].x * gs, cauda[0].y * gs, gs - 2, gs - 2);
            sock.emit('xy', cauda[cauda.length - 1]);
        }
    })

    sock.on('acabou', (p1,p2) => {
        if(id == 1)
        {
            pontos = p1;
            pontos2 = p2;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            desenharPontos();
            comecou = false;
            cauda = [];
            inimigo = [];
            if(pontos == 3)
            {
                console.log('vc ganhou mermao');
                ctx.fillStyle = "lime";
                desenharTexto('Ganhou', "80px Arial");
                textozao('Aperte espaço para reiniciar', "40px Arial");
                fim = true;
            }else if (pontos2 == 3) {
                console.log('vc perdeu vai pra casa estudar');
                ctx.fillStyle = "red";
                desenharTexto('Perdeu', "80px Arial");
                textozao('Aperte espaço para reiniciar', "40px Arial");
                fim = true;
            }
            
        } else if(id == 2) {
            pontos2 = p2;
            pontos = p1;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            desenharPontos();
            comecou = false;
            cauda = [];
            inimigo = [];
            if(pontos2 == 3)
            {
                console.log('vc ganhou mermao');
                ctx.fillStyle = "lime";
                desenharTexto('Ganhou', "80px Arial");
                textozao('Aperte espaço para reiniciar', "40px Arial");
                fim = true;
            }else if (pontos == 3) {
                console.log('vc perdeu vai pra casa estudar');
                ctx.fillStyle = "red";
                desenharTexto('Perdeu', "80px Arial");
                textozao('Aperte espaço para reiniciar', "40px Arial");
                fim = true;
            }
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

function desenharPontos()
{
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.font = "40px Arial";
    if(id == 1)
    {
        ctx.fillStyle = "lime";
        ctx.fillText(pontos,50,55);
        ctx.fillStyle = "tomato";
        ctx.fillText(pontos2,750,55);
    } else if(id == 2)
    {
        ctx.fillStyle = "tomato";
        ctx.fillText(pontos,50,55);
        ctx.fillStyle = "lime";
        ctx.fillText(pontos2,750,55);
    }
}

function desenharTexto(texto, fonte)
{
    ctx.font = "80px Arial";
    ctx.font = fonte;
    ctx.textAlign = "center";
    ctx.fillText(texto,canvas.width /2,canvas.height /2);
}

function textozao(text, font) 
{
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.fillText(text,canvas.width /2,canvas.height /2 + 50);

}

function testarColisao(index) {
    if(cauda[cauda.length - 1].x * gs == cauda[index].x * gs
        && cauda[cauda.length - 1]. y * gs == cauda[index].y * gs) {
            perdeu = true;
            console.log('colidiu consigo');
            sock.emit('perdi', id);
        }
}

function testarColisaoInimigo(index) {
    if(cauda[cauda.length - 1].x * gs == inimigo[index].x * gs
        && cauda[cauda.length - 1]. y * gs == inimigo[index].y * gs) {
            if(index == inimigo.length -1)
            {
                perdeu = true;
                console.log('empate');
                sock.emit('empate', id);
            } else {
                perdeu = true;
                console.log('colidiu inimigo');
                sock.emit('perdi', id);
            }
            
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
    } else if(cauda[cauda.length - 1]. y * gs == 80){
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
            if(xv != 1)
            {
                xv = -1; yv = 0;
            }
        }
        if (evt.keyCode == 38) {
            if(yv != 1)
            {
                xv = 0; yv = -1;
            }
        }
        if (evt.keyCode == 39) {
            if(xv != -1)
            {
                xv = 1; yv = 0;
            }
        }
        if (evt.keyCode == 40) {
            if(yv != -1)
            {
                xv = 0; yv = 1;
            }
        }
    }
    if(fim == true){
        if (evt.keyCode == 32) {
            sock.emit('restart', id);
            console.log('quero recomeçar, esperando adversario');
            fim = false;
            
        }
    }
}