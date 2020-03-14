const tf = require('@tensorflow/tfjs');
const fs = require('fs');

let entradas = [];
let classes = [];
let execucao = [];

function addFile(path) {
	let data = fs.readFileSync(path, {encoding: 'utf8'});
	data = data.toString().trim();

	let carac = ',';
	if(data.indexOf(';') >= 0) carac = ';';
	let lines = data.split('\r\n');
	for(let i=1; i<lines.length; i++) {
		let inputs = [];
		let celulas = lines[i].split(carac);
		for(let j=0; j<(celulas.length-1); j++) {
			inputs.push(toInput(celulas[j]));
		}
		entradas.push(inputs);
		classes.push(celulas[celulas.length-1].trim());
	}
}

function toInput(str) {
	let result = 0;
	if(typeof(str)=='object') {
		let array = str[0];
		let temp = [];
		for(let i=0; i<array.length; i++) {
			temp.push(toInput(array[i]));
		}
		result = [temp];
	}else {
		if(!isNaN(str)) {
			// é número
			result = Number(str);
		}else {
			// não é número
			result = [...str].map(char => char.charCodeAt(0))
							 .reduce((previous, current) => previous + current);
			result = Number(parseFloat(Math.sqrt(result)).toFixed(0));
		}
	}
	return result;
}

function menoresNumeros(matriz) {
	let result = [];
	for(let i=0; i<matriz.length; i++) {
		let vetor = matriz[i];
		let sum = 0;
		for(let j=0; j<vetor.length; j++) {
			sum += vetor[j];
		}
		result.push(sum);
	}
	return result;
}

function knn() {
	let tfTreinosEntradas = tf.tensor(entradas);
	let tfTreinosClasses = tf.tensor(classes);
	let tfExecucaoEntradas = tf.tensor(toInput(execucao));

	let tfDiferencas = tfExecucaoEntradas.sub(tfTreinosEntradas).abs();
	let arrayDiferencas = menoresNumeros(tfDiferencas.arraySync());
	let menor = tf.tensor(arrayDiferencas).min().arraySync();

	let entradaClasse = classes[arrayDiferencas.indexOf(menor)];

	return entradaClasse;
}

function classification(execInput=false) {
	if(!execInput) {
		execucao = [[33, 'Programador', 7, 5000, 'Sim', 2]];
		console.log(`Classificação: ${knn()}`);
	}else {
		execucao = [execInput];
		return knn();
	}
}

function classificationAll(path) {
	let entradasLocal = [];
	let entradasOriginal = [];

	let data = fs.readFileSync(path, {encoding: 'utf8'});
	data = data.toString().trim();

	let carac = ',';
	if(data.indexOf(';') >= 0) carac = ';';
	let lines = data.split('\r\n');
	for(let i=1; i<lines.length; i++) {
		let inputs = [];
		let inputsOriginal = [];
		let celulas = lines[i].split(carac);
		for(let j=0; j<(celulas.length-1); j++) {
			inputsOriginal.push(celulas[j]);
			inputs.push(toInput(celulas[j]));
		}
		entradasOriginal.push(inputsOriginal);
		entradasLocal.push(inputs);
	}

	let txt = lines[0].trim() + '\r\n';
	for(let i=0; i<entradasLocal.length; i++) {
		txt += entradasOriginal[i].join(carac) + carac +
			   classification(entradasLocal[i]) + '\r\n';
	}

	fs.writeFile(path, txt.trim(), 'utf8', (err) => {
		if(err) console.error(err);
		console.log('classificação relizada com sucesso.');
	});
}

addFile('dados01.csv');
classificationAll('execucao01.csv');
//classification();
