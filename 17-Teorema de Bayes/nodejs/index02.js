const tf = require('@tensorflow/tfjs');
const fs = require('fs');

let entradas = [];
let classes = [];
let carregados = '';

let classesIndex = 0;
let objClasses = [];

function addFile(path) {
	let data = fs.readFileSync(path, {encoding: 'utf8'});
	data = data.toString().trim();

	let Classe = path.substr(0, path.indexOf('.')).toString().trim();
	objClasses.push({classe: Classe, indice: classesIndex});

	data = data.replace(/\r\n\r\n/g, '');
	let lines = data.split('\r\n');

	for(let i=0; i<lines.length; i++) {
		// tokenização de texto
		let tokens = lines[i].split(' ');

		entradas.push(arrayStringToNumber(tokens));
		classes.push([classesIndex]);
	}
	classesIndex++;
}

// elimina os elementos duplicados
function eliminaDuplicados(arr) {
	arr = [...new Set(arr)];
	return arr;
}

// converte o texto para o número correspondente
function arrayStringToNumber(arr) {
	let result = [];
	let qtd = 0;
	let sum = 0;
	for(let i=0; i<arr.length; i++) {
		let element = arr[i];
		if(element.length>0) {
			element = [...element].map(char => char.charCodeAt(0))
								  .reduce((current, previous) => previous + current);
			sum += Math.sqrt(element);
			qtd++;
		}else {
			sum += 0;
		}
	}
	let mean = parseFloat(sum / qtd).toFixed(0);
	result.push(Number(mean));
	return result;
}

// converte o número para a classe correspondente
function toClass(arr) {
	let result = '';
	let output = arr[0];
	for(let i=0; i<objClasses.length; i++) {
		if(objClasses[i].indice == output) result = objClasses[i].classe;
	}
	return result;
}

async function execClassification(path='', teste=false) {
	let data = fs.readFileSync(path, {encoding: 'utf8'});
	data = data.toString().trim();

	let Entrada = data;
	let tokenizationEntrada = Entrada.split(' ');

	if(tokenizationEntrada.length > 0) {
		let execucao = arrayStringToNumber(tokenizationEntrada);

		const model = tf.sequential();
		const inputLayer = tf.layers.dense({units: 1, inputShape: [1]});
		model.add(inputLayer);
		model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.001)});

		const x = tf.tensor(entradas, [entradas.length, 1]);
		const y = tf.tensor(classes, [classes.length, 1]);

		const input = tf.tensor(execucao, [execucao.length, 1]);

		await model.fit(x, y, {epochs: 500});

		let output = model.predict(input).abs().round().dataSync();
		output = toClass(output);
		if(teste) return output;
		else console.log({Class: output});
	}
}

async function test() {
	let testClass = ['Elon Musk', 'Jeff Bezos'];
	let acertos = erros = 0;
	for(let i=0; i<testClass.length; i++) {
		for(let j=0; j<10; j++) {
			let retorno = await execClassification(`./Testes/${testClass[i]}/teste${j}.txt`, true);
			if(retorno==testClass[i]) acertos++;
			else erros++;
		}
	}
	let confiabilidade = (acertos/(acertos+erros))*100;
	console.log(`confiabilidade: ${confiabilidade}%`);
}

addFile('Elon Musk.txt');
addFile('Jeff Bezos.txt');
//test();
execClassification('Teste - Elon Musk.txt');
