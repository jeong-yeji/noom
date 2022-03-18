import http from 'http';
import SocketIO from 'socket.io';
import express from 'express';

const app = express();

app.set('view engine', 'pug'); // set view engine as pug
app.set('views', __dirname + '/views'); // template path
app.use('/public', express.static(__dirname + '/public')); // create public url
app.get('/', (_, res) => res.render('home')); // route handler
app.get('/*', (_, res) => res.redirect('/')); // catchall url

// http server
const httpServer = http.createServer(app);
// IO(Web Socket) Server
const wsServer = SocketIO(httpServer);

function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer; // same as following codes
    // const sids = wsServer.sockets.adapters.sids;
    // const rooms = wsServer.sockets.adapters.rooms;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });

    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on('connection', (socket) => {
    socket['nickname'] = 'Annoymous';
    wsServer.sockets.emit('room_change', publicRooms());

    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });

    // get room name >> 10 secs later >> call done() from BE & execute done() on FE
    socket.on('enter_room', (roomName, nickname, done) => {
        socket['nickname'] = nickname;
        // In Socket.io, all sockets(users) have a private room between them and server.
        socket.join(roomName);
        done();
        socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
        wsServer.sockets.emit('room_change', publicRooms());
    });

    // disconnecting : the client is going to be disconnected, but hasn't left yet
    socket.on('disconnecting', () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1);
        });
    });

    socket.on('disconnect', () => {
        wsServer.sockets.emit('room_change', publicRooms());
    });

    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
        done();
    });

    socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});

/*
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
*/

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);
