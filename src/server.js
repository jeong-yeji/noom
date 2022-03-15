import http from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'pug'); // set view engine as pug
app.set('views', __dirname + '/views'); // template path
app.use('/public', express.static(__dirname + '/public')); // create public url
app.get('/', (_, res) => res.render('home')); // route handler
app.get('/*', (_, res) => res.redirect('/')); // catchall url

const handleListen = () => console.log('Listening on http://localhost:3000');

// http server
const server = http.createServer(app);
// web socket server
const wss = new WebSocketServer({ server });

const sockets = [];

// the socket of server.js represents connected browser
// use annoymous function
wss.on('connection', (socket) => {
    sockets.push(socket);
    socket['nickname'] = 'Anonymous';
    console.log('Connected to Browser ✔');
    socket.on('close', () => console.log('Disconnected from the Browser ❌'));
    socket.on('message', (msg) => {
        const message = JSON.parse(msg); // from String to JS object
        switch (message.type) {
            case 'new_message':
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case 'nickname':
                socket['nickname'] = message.payload;
        }
    });
});

server.listen(3000, handleListen);
