import express from 'express';

const app = express();

app.set('view engine', 'pug'); // set view engine as pug
app.set('views', __dirname + '/views'); // template path
app.use('/public', express.static(__dirname + '/public')); // create public url
app.get('/', (req, res) => res.render('home')); // route handler

const handleListen = () => console.log('Listening on http://localhost:3000');
app.listen(3000, handleListen);
