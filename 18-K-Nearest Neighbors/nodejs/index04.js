const tf = require('@tensorflow/tfjs');
const fs = require('fs');

let entradas = [];
let classes = [];
let execucao = [];
let classesNomes = [];

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
	classesNomes = [... new Set(classes)];
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

function toNumberClass(strClass='') {
	let index = 0;
	for(let i=0; i<classesNomes.length; i++) {
		if(classesNomes[i].trim()==strClass.trim()) {
			index = i;
		}
	}
	return Number(index);
}

function toStringClass(numberClass=0) {
	numberClass = Number(parseFloat(numberClass[0]).toFixed(0));
	if(numberClass>(classesNomes.length-1)) numberClass = Number(classesNomes.length-1);

	let name = '';
	for(let i=0; i<classesNomes.length; i++) {
		if(i==numberClass) {
			name = classesNomes[i].trim();
		}
	}
	return name;
}

function toArrayNumberClass(arrClass) {
	let result = [];
	for(let i=0; i<arrClass.length; i++) {
		result.push(toNumberClass(arrClass[i]));
	}
	return result;
}

async function classificadorRNA() {
	let outputs = toArrayNumberClass(classes);

	const model = tf.sequential();
	const inputLayer = tf.layers.dense({units: 1, inputShape: [entradas[0].length], activation: 'sigmoid'});
	model.add(inputLayer);
	model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.00000001)});

	const x = tf.tensor(entradas, [entradas.length, entradas[0].length]);
	const y = tf.tensor(outputs, [outputs.length, 1]);

	const input = tf.tensor(toInput(execucao), [execucao.length, entradas[0].length]);

	await model.fit(x, y, {epochs: 500});
	let output = model.predict(input).abs().round().arraySync();
	output = toStringClass(output);
	return output;
}

async function classification(execInput=false) {
	if(!execInput) {
		execucao = [[50, 'Porteiro', 10, 1200, 'Sim', 2]];
		console.log(`Classificação: ${await classificadorRNA()}`);
	}else {
		execucao = [execInput];
		return await classificadorRNA();
	}
}

async function classificationAll(path) {
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
			   await classification(entradasLocal[i]) + '\r\n';
	}

	fs.writeFile(path, txt.trim(), 'utf8', (err) => {
		if(err) console.error(err);
		console.log('classificação relizada com sucesso.');
	});
}

function compare(path1, path2) {
	let data1 = fs.readFileSync(path1, {encoding: 'utf8'});
	data1 = data1.toString().trim();

	let data2 = fs.readFileSync(path2, {encoding: 'utf8'});
	data2 = data2.toString().trim();

	let carac1 = ',';
	if(data1.indexOf(';') >= 0) carac1 = ';';
	let lines1 = data1.split('\r\n');

	let carac2 = ',';
	if(data2.indexOf(';') >= 0) carac2 = ';';
	let lines2 = data2.split('\r\n');

	let acertos = 0;
	for(let i=1; i<lines1.length; i++) {
		let celulas1 = lines1[i].split(carac1);
		let celulas2 = lines2[i].split(carac2);
		let class1 = celulas1[celulas1.length-1];
		let class2 = celulas2[celulas2.length-1];

		if(class1==class2) acertos++;
	}
	console.log(`acertos: ${acertos} de ${lines1.length-1}`);
}

compare('dados01.csv', 'execucao01.csv');
//addFile('dados01.csv');
//classificationAll('execucao01.csv');
//classification();
