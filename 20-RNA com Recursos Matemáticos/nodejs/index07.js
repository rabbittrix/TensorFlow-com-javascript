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
			 Outputs=[], 
			 Epochs=1, 
			 Activation='sigmoid', 
			 Bias=0, 
			 hiddenLayers=0,
			 model='') {

	for(let i=0; i<Outputs.length; i++) {
		train(Inputs, 
			  Outputs[i], 
			  Epochs, 
			  Activation, 
			  Bias, 
			  hiddenLayers+1,
			  model);
	}
	console.log('treinamento salvo com sucesso.');
}

function train(Inputs=[], 
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
	let path = `./models/${model}.bin`;

	Inputs = toArrayJS(Inputs);
	arrInputWeight = toArrayJS(arrInputWeight);
	matrixHiddenWeight = toMatrixJS(matrixHiddenWeight);

	let json = {Inputs: Inputs,
				arrInputWeight: arrInputWeight,
				matrixHiddenWeight: matrixHiddenWeight,
				Bias: Bias,
				Activation: Activation,
				hiddenLayers: hiddenLayers};
	let tempJSON = [];
	tempJSON.push(json);

	let objJSON = [];
	if(fs.existsSync(path)) {
		modelo = fs.readFileSync(path, {encoding: 'utf8'});
		modelo = modelo.toString().trim();
		try {
			objJSON = JSON.parse(modelo);
			objJSON.push(json);
		}catch(e) { objJSON = tempJSON; }
	}else {
		objJSON.push(json);
	}

	let data = JSON.stringify(objJSON);
	fs.writeFileSync(path, data);
}

function predict(Inputs=[], model='', nOutputs=1) {
	let result = [];
	const fs = require('fs');
	if(model.toString().trim().length<=0) model = 'model';
	let modelo = '';
	modelo = fs.readFileSync(`./models/${model}.bin`, {encoding: 'utf8'});
	modelo = modelo.toString().trim();

	let objJSON = [];
	try { objJSON = JSON.parse(modelo); }catch(e) { objJSON = []; }

	if(objJSON.length>0) {
		let tfInput1 = tf.tensor(Inputs);
		let arrSub = [];
		for(let i=0; i<objJSON.length; i++) {
			let tfInput2 = tf.tensor(objJSON[i].Inputs);
			let tempSub = tfInput1.sub(tfInput2).abs().sum().arraySync();

			arrSub.push(tempSub);
		}

		for(let n=0; n<nOutputs; n++) {
			let index = 0;
			let minimo = tf.tensor(arrSub).min().arraySync();
			for(let i=0; i<arrSub.length; i++) {
				if(minimo==arrSub[i]) index = i;
			}

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
			result.push(tfOutput.arraySync()[0]);

			arrSub.shift();
		}
		return tf.tensor(result).reverse().arraySync();
	}else {
		return result;
	}
}

//fit([0.1, 0.2], [0.5, 0.6, 0.7, 0.8], 400, 'sigmoid', 0, 1, 'dados01');
console.log(predict([0.1, 0.2], 'dados01', 4));
