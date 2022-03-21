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

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);
