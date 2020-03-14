const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const model = tf.sequential();
let arrUltimo = [];

async function treino() {
	let arquivo = fs.readFileSync('cotacao-do-euro.csv', {encoding: 'utf8'});
	arquivo = arquivo.toString().trim();

	const linhas = arquivo.split('\r\n');
	let X = [];
	let Y = [];
	let qtdLinhas = 0;

	arrUltimo = linhas[1].split(';');
	arrUltimo.shift();

	for(let l=1; l<linhas.length; l++) {
		let celulas1 = [];
		if(qtdLinhas==(linhas.length-2)) celulas1 = ['31.12.2018', 4.4520, 4.4416, 4.4520, 4.4329];
		else celulas1 = linhas[l+1].split(';');

		const celulas2 = linhas[l].split(';');

		const FechamentoX = Number(celulas1[1]);
		const AberturaX   = Number(celulas1[2]);
		const MaximaX     = Number(celulas1[3]);
		const MinimaX     = Number(celulas1[4]);

		X.push([FechamentoX, AberturaX, MaximaX, MinimaX]);

		const FechamentoY = Number(celulas2[1]);
		const AberturaY   = Number(celulas2[2]);
		const MaximaY     = Number(celulas2[3]);
		const MinimaY     = Number(celulas2[4]);

		Y.push([FechamentoY, AberturaY, MaximaY, MinimaY]);

		qtdLinhas++;
	}

	const inputLayer = tf.layers.dense({units: 8, inputShape: [4]});
	const hiddenLayer = tf.layers.dense({units: 4, inputShape: [8]});
	model.add(inputLayer);
	model.add(hiddenLayer);
	model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.005)});

	const x = tf.tensor(X, [qtdLinhas, 4]);
	const y = tf.tensor(Y);

	let erro = await model.fit(x, y, {epochs: 50});
	console.log('Cotação do Euro em R$ (Reais)');
	console.log(`taxa de erro: ${erro.history.loss[0]}`);
}

async function predicao(dias=1) {
	await treino();

	let arrInput = [
						[
						 Number(arrUltimo[0]), 
						 Number(arrUltimo[1]), 
						 Number(arrUltimo[2]), 
						 Number(arrUltimo[3])
						]
				   ];

	let input = tf.tensor(arrInput, [1, 4]);

	for(let i=0; i<dias; i++) {
		let output = model.predict(input).dataSync();
		output = ordenaDados(output);

		let data = new Date();
		data.setDate(data.getDate()+i);

		const Data       = data.getDate()+'/'+data.getMonth()+'/'+data.getFullYear(); 
		const Fechamento = Number(output[0]).toFixed(4);
		const Abertura   = Number(output[1]).toFixed(4);
		const Maxima     = Number(output[2]).toFixed(4);
		const Minima     = Number(output[3]).toFixed(4);

		console.log('----------------------------------------------');
		console.log('DATA       - Fecham - Abertu - Máxima - Mínima');
		console.log(`${Data.padEnd(10, ' ')} - ${Fechamento} - ${Abertura} - ${Maxima} - ${Minima}`);
		console.log('----------------------------------------------');

		arrInput = [
						[
						 Number(output[0]), 
						 Number(output[1]), 
						 Number(output[2]), 
						 Number(output[3])
						]
				   ];

		input = tf.tensor(arrInput, [1, 4]);
	}	
}

function ordenaDados(array) {
	function sortNumber(a, b) {
		return (a - b);
	}

	let fechamento = array[0];
	let abertura   = array[1];
	let maxima     = array[2];
	let minima     = array[3];

	let cotacoes = [fechamento, abertura, maxima, minima];
	cotacoes = cotacoes.sort(sortNumber);

	let menor = cotacoes[0];
	let maior = cotacoes[3];

	if(fechamento<minima) fechamento = minima;
	if(abertura<minima) abertura = minima;
	if(maxima<minima) maxima = minima;
	minima = menor;

	if(fechamento>maxima) fechamento = maxima;
	if(abertura>maxima) abertura = maxima;
	if(minima>maxima) minima = maxima;
	maxima = maior;

	cotacoes = [fechamento, abertura, maxima, minima];
	return cotacoes;
}

predicao(50);
