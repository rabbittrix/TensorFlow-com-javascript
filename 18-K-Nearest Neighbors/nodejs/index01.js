const tf = require('@tensorflow/tfjs');
const fs = require('fs');

let eixoX =  [];
let eixoY =  [];
let classe = [];

let entradaX = 0;
let entradaY = 0;

function addFile(path) {
	let data = fs.readFileSync(path, {encoding: 'utf8'});
	data = data.toString().trim();

	let carac = ',';
	if(data.indexOf(';') >= 0) carac = ';';
	let lines = data.split('\r\n');
	for(let i=1; i<lines.length; i++) {
		let celulas = lines[i].split(carac);
		eixoX.push(Number(celulas[0]));
		eixoY.push(Number(celulas[1]));
		classe.push(celulas[2].toString().trim());
	}	
}

function knn() {
	let tensorX = tf.tensor(eixoX);
	let tensorY = tf.tensor(eixoY);
	let tfEntradaX = tf.scalar(entradaX);
	let tfEntradaY = tf.scalar(entradaY);

	let tfRaiz = tensorX.sub(tfEntradaX).square()
						.add(tensorY.sub(tfEntradaY).square()).sqrt();

	let menorRaiz = tfRaiz.min().dataSync();
	let arrayRaiz = tfRaiz.dataSync();

	let entradaClasse = classe[arrayRaiz.indexOf(menorRaiz[0])];

	return entradaClasse;
}

function classification() {
	entradaX = Number(process.argv[2]);
	entradaY = Number(process.argv[3]);
	
	console.log(`Classificação: ${knn()}`);
}

addFile('../dados01.csv');
classification();
