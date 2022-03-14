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

// the socket of server.js represents connected browser
function handleConnection(socket) {
    console.log(socket);
}
wss.on('connection', handleConnection);

server.listen(3000, handleListen);
