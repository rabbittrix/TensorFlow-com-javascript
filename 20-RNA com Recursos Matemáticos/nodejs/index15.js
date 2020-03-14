const nettf = require('./RNATensorFlow');
const fs = require('fs');

const config = {
	epochs: 400, 
	activation: 'sigmoid', 
	bias: 0, 
	hiddenLayers: 1, 
	model: 'dolar',
	dense: false,
	nOutputs: 4,
	formatIO: true
};

const net = new nettf(config);

let arrUltimo = [];

function alimentaUltimo() {
	let arquivo = fs.readFileSync('cotacao-do-dolar.csv', {encoding: 'utf8'});
	arquivo = arquivo.toString().trim();

	const linhas = arquivo.split('\r\n');

	arrUltimo = linhas[1].split(';');
	arrUltimo.shift();	
}

function treino() {
	let arquivo = fs.readFileSync('cotacao-do-dolar.csv', {encoding: 'utf8'});
	arquivo = arquivo.toString().trim();

	const linhas = arquivo.split('\r\n');
	let X = [];
	let Y = [];
	let qtdLinhas = 0;

	arrUltimo = linhas[1].split(';');
	arrUltimo.shift();

	for(let l=1; l<linhas.length; l++) {
		let celulas1 = [];
		if(qtdLinhas==(linhas.length-2)) celulas1 = ['31.12.2018', 3.8813, 3.8813, 3.8813, 3.8813];
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

	const x = X;
	const y = Y;

	net.fit(x, y);
}

function predicao(dias=1) {
	alimentaUltimo();
	let arrInput = [
					 Number(arrUltimo[0]), 
					 Number(arrUltimo[1]), 
					 Number(arrUltimo[2]), 
					 Number(arrUltimo[3])
				   ];

	let input = arrInput;

	let strLines = 'Data;Fechamento;Abertura;Máxima;Mínima\r\n';

	for(let i=0; i<dias; i++) {
		let output = net.predict(input);
		output = ordenaDados(output);

		let data = new Date();
		data.setDate(data.getDate()+i);

		const Data       = formatData(data.getDate())+'.'+formatData(data.getMonth())+'.'+data.getFullYear(); 
		const Fechamento = Number(output[0]).toFixed(4);
		const Abertura   = Number(output[1]).toFixed(4);
		const Maxima     = Number(output[2]).toFixed(4);
		const Minima     = Number(output[3]).toFixed(4);

		strLines += `${Data};${Fechamento};${Abertura};${Maxima};${Minima}\r\n`;

		arrInput = [
					 Number(output[0]), 
					 Number(output[1]), 
					 Number(output[2]), 
					 Number(output[3])
				   ];

		input = arrInput;
	}	

	fs.writeFileSync('./predicao-dolar.csv', strLines);
	console.log('predição salva com sucesso.');
}

function formatData(data) {
	data = data.toString().trim();
	let dataLength = data.length;

	if(dataLength==1) data = '0'.concat(data);

	return data;
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

//treino();
predicao(50);
