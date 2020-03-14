const tf = require('@tensorflow/tfjs');

function derivada(n) { return n.mul(tf.scalar(1).sub(n)); }

function tangenteHiperbolica(n) { return n.tanh(); }
function sigmoid(n) { return n.sigmoid(); }
function relu(n) { return n.relu(); }
function leakyRelu(n) { return n.leakyRelu(); }
function softmax(n) { return n.softmax(); }
function softplus(n) { return n.softplus(); }

function funcaoAtivacao(n, func='sigmoid') {
	const funcao = func.toString().trim();
	if(funcao == 0) return tangenteHiperbolica(n);
	else if(funcao == 1) return sigmoid(n);
	else if(funcao == 2) return relu(n);
	else if(funcao == 3) return leakyRelu(n);
	else if(funcao == 4) return softmax(n);
	else return softplus(n);
}

function fit(Inputs=[], 
			 Target=0, 
			 Epochs=1, 
			 Activation='sigmoid', 
			 Bias=0, 
			 hiddenLayers=0,
			 model='') {

	const arrInput = validaInput(Inputs);

	const target = Number(Target);
	const tfTarget = tf.scalar(target);

	let arrInputWeight = [];
	for(let i=0; i<arrInput.length; i++) {
		arrInputWeight.push(tf.randomUniform([1, 1]).flatten());
	}

	let matrixHiddenWeight = [];
	for(let i=0; i<arrInput.length; i++) {
		let arrHiddenWeight = [];
		for(let h=0; h<hiddenLayers; h++) {
			arrHiddenWeight.push(tf.randomUniform([1, 1]).flatten());
		}
		matrixHiddenWeight.push(arrHiddenWeight);
	}

	const epochs = Number(Epochs);

	for(let i=1; i<=epochs; i++) {
		let tfProd = [];
		for(let x=0; x<arrInput.length; x++) {
			tfProd.push(arrInput[x].mul(arrInputWeight[x]));
		}

		for(let x=0; x<arrInput.length; x++) {
			for(let y=0; y<hiddenLayers; y++) {
				tfProd[x] = tfProd[x].mul(matrixHiddenWeight[x][y]);
			}
		}

		let sum = tf.scalar(0);
		for(let x=0; x<arrInput.length; x++) {
			sum = sum.add(tfProd[x]);
		}
		sum.add(tf.scalar(Bias));

		let tfOutput = funcaoAtivacao(sum, Activation);
		if(tfOutput.arraySync()[0]==Infinity) {
			fit(Inputs, Target, Epochs, Activation, Bias, hiddenLayers+1, model);
			break;
		}
		let tfError = tfTarget.sub(tfOutput);

		for(let x=0; x<arrInput.length; x++) {
			arrInputWeight[x] = 
			arrInputWeight[x].add(arrInput[x].mul(derivada(tfError)));
		}
		for(let x=0; x<arrInput.length; x++) {
			for(let y=0; y<hiddenLayers; y++) {
				matrixHiddenWeight[x][y] = 
				matrixHiddenWeight[x][y].add(arrInput[x].mul(derivada(tfError)))
			}
		}

		if(corte(target, tfOutput)) {
			i = epochs+1;
			saveModel(Inputs, 
				      arrInputWeight, 
				      matrixHiddenWeight, 
				      Bias, 
				      Activation, 
				      hiddenLayers,
				      model);
		}
	}
}

function validaInput(arr=[]) {
	try
	{
		for(let i=0; i<arr.length; i++) {
			if(arr[i]==0) arr[i] = 0.1;
			arr[i] = tf.scalar(arr[i]);
		}
	} catch(e) { return arr; }
	return arr;
}

function corte(target, output) {
	const strTarget = target.toString().trim();
	if(strTarget.indexOf('.') >= 0) {
		target = parseFloat(target).toFixed(2);
		output = parseFloat(output.arraySync()).toFixed(2);
	}else {
		target = parseFloat(target).toFixed(0);
		output = parseFloat(output.arraySync()).toFixed(0);
	}
	if(target == output) return true; return false;
}

function toArrayJS(arrTensor=[]) {
	let array = [];
	for(let i=0; i<arrTensor.length; i++) {
		array.push(arrTensor[i].arraySync());
	}
	return array;
}

function toMatrixJS(matrixTensor=[]) {
	let matrix = [];
	for(let i=0; i<matrixTensor.length; i++) {
		let array = [];
		for(let j=0; j<matrixTensor[i].length; j++) {
			array.push(matrixTensor[i][j].arraySync());
		}
		matrix.push(array);
	}
	return matrix;
}

function toArrayTensor(array=[]) {
	let arrayTensor = [];
	for(let i=0; i<array.length; i++) {
		arrayTensor.push(tf.tensor(array[i]));
	}
	return arrayTensor;
}

function toMatrixTensor(matrix=[]) {
	let matrixTensor = [];
	for(let i=0; i<matrix.length; i++) {
		let arrayTensor = [];
		for(let j=0; j<matrix[i].length; j++) {
			arrayTensor.push(tf.tensor(matrix[i][j]));
		}
		matrixTensor.push(arrayTensor);
	}
	return matrix;
}

function saveModel(Inputs=[], 
				   arrInputWeight=[], 
				   matrixHiddenWeight=[], 
				   Bias=0, 
				   Activation='sigmoid', 
				   hiddenLayers=0,
				   model='') {

	const fs = require('fs');
	if(model.toString().trim().length<=0) model = 'model';
	let modelo = '';
	try {
		modelo = fs.readFileSync(`./models/${model}.bin`, {encoding: 'utf8'});
		modelo = modelo.toString().trim();
	}catch(e) { modelo = '[]'; }

	let objJSON = [];
	try {
		objJSON = JSON.parse(modelo);
		if(!Array.isArray(objJSON)) objJSON = [];
	}catch(e) { objJSON = []; }

	Inputs = toArrayJS(Inputs);
	arrInputWeight = toArrayJS(arrInputWeight);
	matrixHiddenWeight = toMatrixJS(matrixHiddenWeight);

	objJSON.push({Inputs: Inputs,
				  arrInputWeight: arrInputWeight,
				  matrixHiddenWeight: matrixHiddenWeight,
				  Bias: Bias,
				  Activation: Activation,
				  hiddenLayers: hiddenLayers});

	fs.writeFile(`./models/${model}.bin`, JSON.stringify(objJSON), (err) => {
		if(err) console.error(err);
		console.log('treinamento salvo com sucesso.');
	});
}

function predict(Inputs=[], model='') {
	const fs = require('fs');
	if(model.toString().trim().length<=0) model = 'model';
	let modelo = '';
	try {
		modelo = fs.readFileSync(`./models/${model}.bin`, {encoding: 'utf8'});
		modelo = modelo.toString().trim();
	}catch(e) { modelo = '[]'; }

	let objJSON = [];
	try {
		objJSON = JSON.parse(modelo);
		if(!Array.isArray(objJSON)) objJSON = [];
	}catch(e) { objJSON = []; }

	let tfInput1 = tf.tensor(Inputs);
	let index = 0;
	let sub = 99999999999999999999999999;
	for(let i=0; i<objJSON.length; i++) {
		let tfInput2 = tf.tensor(objJSON[i].Inputs);
		let tempSub = tfInput1.sub(tfInput2).abs().sum().arraySync();

		if(tempSub<sub) {
			sub = tempSub;
			index = i;
		}
	}

	if(objJSON.length>0) {
		const arrInput = validaInput(Inputs);
		const arrInputWeight = toArrayTensor(objJSON[index].arrInputWeight);
		const matrixHiddenWeight = toMatrixTensor(objJSON[index].matrixHiddenWeight);
		const Bias = objJSON[index].Bias;
		const Activation = objJSON[index].Activation;
		const hiddenLayers = objJSON[index].hiddenLayers;

		let tfProd = [];
		for(let x=0; x<arrInput.length; x++) {
			tfProd.push(arrInput[x].mul(arrInputWeight[x]));
		}

		for(let x=0; x<arrInput.length; x++) {
			for(let y=0; y<hiddenLayers; y++) {
				tfProd[x] = tfProd[x].mul(matrixHiddenWeight[x][y]);
			}
		}

		let sum = tf.scalar(0);
		for(let x=0; x<arrInput.length; x++) {
			sum = sum.add(tfProd[x]);
		}
		sum.add(tf.scalar(Bias));

		let tfOutput = funcaoAtivacao(sum, Activation);

		return tfOutput.arraySync();
	}else {
		return [];
	}
}

//fit([1, 1], 0, 100, 'sigmoid', 0, 1, 'xor');

console.log(`0 AND 0 = ${parseFloat(predict([0, 0], 'and')).toFixed(0)}`);
console.log(`0 AND 1 = ${parseFloat(predict([0, 1], 'and')).toFixed(0)}`);
console.log(`1 AND 0 = ${parseFloat(predict([1, 0], 'and')).toFixed(0)}`);
console.log(`1 AND 1 = ${parseFloat(predict([1, 1], 'and')).toFixed(0)}`);
console.log('');
console.log(`0  OR 0 = ${parseFloat(predict([0, 0], 'or' )).toFixed(0)}`);
console.log(`0  OR 1 = ${parseFloat(predict([0, 1], 'or' )).toFixed(0)}`);
console.log(`1  OR 0 = ${parseFloat(predict([1, 0], 'or' )).toFixed(0)}`);
console.log(`1  OR 1 = ${parseFloat(predict([1, 1], 'or' )).toFixed(0)}`);
console.log('');
console.log(`0 XOR 0 = ${parseFloat(predict([0, 0], 'xor')).toFixed(0)}`);
console.log(`0 XOR 1 = ${parseFloat(predict([0, 1], 'xor')).toFixed(0)}`);
console.log(`1 XOR 0 = ${parseFloat(predict([1, 0], 'xor')).toFixed(0)}`);
console.log(`1 XOR 1 = ${parseFloat(predict([1, 1], 'xor')).toFixed(0)}`);
