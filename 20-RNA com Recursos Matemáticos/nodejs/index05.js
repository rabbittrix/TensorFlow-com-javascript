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

function MLPMultivariado(Inputs=[], 
						 Outputs=[], 
						 Epochs=1, 
						 Activation='sigmoid', 
						 Bias=0, 
						 hiddenLayers=0) {

	let printErro = [];
	let printOutput = [];
	for(let out=0; out<Outputs.length; out++) {
		const arrInput = validaInput(Inputs);

		const target = Number(Outputs[out]);
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
				printErro.push(Number(parseFloat(tfError.abs().arraySync()).toFixed(4)));
				printOutput.push(Number(parseFloat(tfOutput.arraySync()).toFixed(8)));
				i = epochs+1;
			}
		}
	}

	for(let i=0; i<printOutput.length; i++) {
		console.log(`taxa de erro: ${printErro[i]} - saída: ${printOutput[i]}`);
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

MLPMultivariado([0.5, 0], [0.7, 0.8], 400, 'sigmoid', 0, 1);
