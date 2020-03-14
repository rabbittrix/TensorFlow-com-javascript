const express = require('express');
const app = express()

app.use('/img', express.static(__dirname + '/img'));
app.use('/video', express.static(__dirname + '/video'));

app.listen(3000);
console.log('servidor rodando em: localhost:3000');

// localhost:3000/imagem-home
app.get('/imagem-home', function(req, res) {
	res.set('Content-Type', 'text/html');
	const fs = require('fs');
	const data = fs.readFileSync('./index01.html', 'utf8');
	res.send(data);
});

// localhost:3000/video-home
app.get('/video-home', function(req, res) {
	res.set('Content-Type', 'text/html');
	const fs = require('fs');
	const data = fs.readFileSync('./index02.html', 'utf8');
	res.send(data);
});

app.get('/bootstrapcss', function(req, res) {
	res.set('Content-Type', 'text/css');
	const fs = require('fs');
	const data = fs.readFileSync('./css/bootstrap.min.css', 'utf8');
	res.send(data);
});

app.get('/jquery', function(req, res) {
	res.set('Content-Type', 'text/javascript');
	const fs = require('fs');
	const data = fs.readFileSync('./js/jquery.min.js', 'utf8');
	res.send(data);
});

app.get('/popper', function(req, res) {
	res.set('Content-Type', 'text/javascript');
	const fs = require('fs');
	const data = fs.readFileSync('./js/popper.min.js', 'utf8');
	res.send(data);
});

app.get('/bootstrapjs', function(req, res) {
	res.set('Content-Type', 'text/javascript');
	const fs = require('fs');
	const data = fs.readFileSync('./js/bootstrap.min.js', 'utf8');
	res.send(data);
});

app.get('/tensorflow', function(req, res) {
	res.set('Content-Type', 'text/javascript');
	const fs = require('fs');
	const data = fs.readFileSync('./tensorflow/tf.min.js', 'utf8');
	res.send(data);
});

app.get('/coco-ssd', function(req, res) {
	res.set('Content-Type', 'text/javascript');
	const fs = require('fs');
	const data = fs.readFileSync('./tensorflow/coco-ssd.js', 'utf8');
	res.send(data);
});

app.get('/action01', function(req, res) {
	res.set('Content-Type', 'text/javascript');
	const fs = require('fs');
	const data = fs.readFileSync('./js/action01.js', 'utf8');
	res.send(data);
});

app.get('/action02', function(req, res) {
	res.set('Content-Type', 'text/javascript');
	const fs = require('fs');
	const data = fs.readFileSync('./js/action02.js', 'utf8');
	res.send(data);
});
