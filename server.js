var express = require('express');
var http = require('http');

var jogadores = [];
var idConect = 0;
var p1 = 0;
var p2 = 0;
var resta = 0;

var app = express();
var server = app.listen(3000);


app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);
io.on('connection', newConnection);

function newConnection(sock) {
    console.log('alguem entrou, wow' + sock.id);
    if(idConect <3)
    {
        idConect++;
        sock.emit('id', idConect);
    }
    if(idConect == 2) {
        io.emit('comece', true, p1, p2);
    }
    jogadores.push(sock.id);
    sock.on('xy', receber);
    function receber(data) {
        sock.broadcast.emit('xy', data);
    }

    sock.on('empate', empate);
    function empate() {
        io.emit('pontos', p1, p2);
    }

    sock.on('perdi', pontos);
    function pontos(id) {
        if(id == 1) {
            p2++;
            console.log(p2);
        } else if(id == 2){
            p1++;
            console.log(p1);
        }
        if(p1 < 3 && p2 < 3)
        {
            io.emit('pontos', p1, p2);
        } else if(p1 == 3 || p2 == 3)
        {
            io.emit('acabou', p1, p2);
        }
    }

    sock.on('restart', restart);
    function restart() {
        resta ++;
        if(resta == 2)
        {
            resta = 0;
            p1 = 0;
            p2 = 0;
            idConect = 1;
            io.sockets.connected[jogadores[0]].emit('id', idConect);
            idConect++;
            io.sockets.connected[jogadores[1]].emit('id', idConect);
            io.emit('comece', true, p1, p2);
        }
    }
}