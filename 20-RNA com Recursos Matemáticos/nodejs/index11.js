const tf = require('@tensorflow/tfjs');

class NeuralNetwork {
	derivada(n) { return n.mul(tf.scalar(1).sub(n)); }

	tangenteHiperbolica(n) { return n.tanh(); }
	sigmoid(n) { return n.sigmoid(); }
	relu(n) { return n.relu(); }
	leakyRelu(n) { return n.leakyRelu(); }
	softmax(n) { return n.softmax(); }
	softplus(n) { return n.softplus(); }

	funcaoAtivacao(n, func='sigmoid') {
		const funcao = func.toString().trim();
		if(funcao == 0) return this.tangenteHiperbolica(n);
		else if(funcao == 1) return this.sigmoid(n);
		else if(funcao == 2) return this.relu(n);
		else if(funcao == 3) return this.leakyRelu(n);
		else if(funcao == 4) return this.softmax(n);
		else return this.softplus(n);
	}

	fit(Inputs=[[]], 
		Outputs=[[]], 
		Config={}) {

		let Epochs=1; 
		let Activation='sigmoid'; 
		let Bias=0;
		let hiddenLayers=0;
		let model='model';
		let dense=false;

		(Config.epochs) ? Epochs = Number(Config.epochs) : Epochs = 1;
		(Config.activation) ? Activation = Config.activation.toString().trim() : Activation = 1;
		(Config.bias) ? Bias = Number(Config.bias) : Bias = 0;
		(Config.hiddenLayers) ? hiddenLayers = Number(Config.hiddenLayers) : hiddenLayers = 0;
		(Config.model) ? model = Config.model.toString().trim() : model = 'model';
		(Config.dense) ? dense = Boolean(Config.dense) : dense = false;

		for(let i=0; i<Inputs.length; i++) {
			this.setTrain(Inputs[i], 
						  Outputs[i], 
						  Epochs, 
						  Activation, 
						  Bias, 
						  hiddenLayers,
						  model,
						  dense);		
		}
		console.log('treinamento salvo com sucesso.');
	}

	setTrain(Inputs=[], 
			 Outputs=[], 
			 Epochs=1, 
			 Activation='sigmoid', 
			 Bias=0, 
			 hiddenLayers=0,
			 model='',
			 dense) {

		for(let i=0; i<Outputs.length; i++) {
			this.train(Inputs, 
					   Outputs[i], 
					   Epochs, 
					   Activation, 
					   Bias, 
					   hiddenLayers,
					   model,
					   dense);
		}
	}

	train(Inputs=[], 
		  Target=0, 
		  Epochs=1, 
		  Activation='sigmoid', 
		  Bias=0, 
		  hiddenLayers=0,
		  model='',
		  dense=false) {

		const arrInput = this.validaInput(Inputs);

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
			if(dense) {
				for(let x=0; x<arrInput.length; x++) {
					let sumProd = 0;
					for(let y=0; y<arrInputWeight.length; y++) {
						sumProd += Number(arrInput[x].mul(arrInputWeight[y]).arraySync());
					}
					tfProd.push(tf.tensor(Number(sumProd)));
				}

				for(let x=0; x<hiddenLayers; x++) {
					for(let y=0; y<arrInput.length; y++) {
						tfProd[y] = tfProd[y].mul(matrixHiddenWeight[y][x]);
					}
				}
			}else {
				for(let x=0; x<arrInput.length; x++) {
					tfProd.push(arrInput[x].mul(arrInputWeight[x]));
				}

				for(let x=0; x<arrInput.length; x++) {
					for(let y=0; y<hiddenLayers; y++) {
						tfProd[x] = tfProd[x].mul(matrixHiddenWeight[x][y]);
					}
				}			
			}

			let sum = tf.scalar(0);
			for(let x=0; x<arrInput.length; x++) {
				sum = sum.add(tfProd[x]);
			}
			sum.add(tf.scalar(Bias));

			let tfOutput = this.funcaoAtivacao(sum, Activation);
			if(tfOutput.arraySync()[0]==Infinity) {
				this.train(Inputs, Target, Epochs, Activation, Bias, hiddenLayers+1, model, dense);
				break;
			}
			let tfError = tfTarget.sub(tfOutput);

			for(let x=0; x<arrInput.length; x++) {
				arrInputWeight[x] = 
				arrInputWeight[x].add(arrInput[x].mul(this.derivada(tfError)));
			}
			for(let x=0; x<arrInput.length; x++) {
				for(let y=0; y<hiddenLayers; y++) {
					matrixHiddenWeight[x][y] = 
					matrixHiddenWeight[x][y].add(arrInput[x].mul(this.derivada(tfError)))
				}
			}

			if(this.corte(target, tfOutput)) {
				i = epochs+1;
				this.saveModel(Inputs, 
						       arrInputWeight, 
						       matrixHiddenWeight, 
						       Bias, 
						       Activation, 
						       hiddenLayers,
						       model,
						       dense);
			}
		}
	}

	validaInput(arr=[]) {
		try
		{
			for(let i=0; i<arr.length; i++) {
				if(arr[i]==0) arr[i] = 0.1;
				arr[i] = tf.scalar(arr[i]);
			}
		} catch(e) { return arr; }
		return arr;
	}

	corte(target, output) {
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

	toArrayJS(arrTensor=[]) {
		let array = [];
		for(let i=0; i<arrTensor.length; i++) {
			array.push(arrTensor[i].arraySync());
		}
		return array;
	}

	toMatrixJS(matrixTensor=[]) {
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

	toArrayTensor(array=[]) {
		let arrayTensor = [];
		for(let i=0; i<array.length; i++) {
			arrayTensor.push(tf.tensor(array[i]));
		}
		return arrayTensor;
	}

	toMatrixTensor(matrix=[]) {
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

	saveModel(Inputs=[], 
			  arrInputWeight=[], 
			  matrixHiddenWeight=[], 
			  Bias=0, 
			  Activation='sigmoid', 
			  hiddenLayers=0,
			  model='',
			  dense=false) {

		const fs = require('fs');
		if(model.toString().trim().length<=0) model = 'model';
		let modelo = '';
		let path = `./models/${model}.bin`;

		Inputs = this.toArrayJS(Inputs);
		arrInputWeight = this.toArrayJS(arrInputWeight);
		matrixHiddenWeight = this.toMatrixJS(matrixHiddenWeight);

		let json = {Inputs: Inputs,
					arrInputWeight: arrInputWeight,
					matrixHiddenWeight: matrixHiddenWeight,
					Bias: Bias,
					Activation: Activation,
					hiddenLayers: hiddenLayers,
					dense: dense};
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

	predict(Inputs=[], Config={}) {
		let result = [];

		let model='model';
		let nOutputs=1;

		(Config.model) ? model = Config.model.toString().trim() : model = 'model';
		(Config.nOutputs) ? nOutputs = Number(Config.nOutputs) : nOutputs = 1;
		
		const fs = require('fs');
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

				const arrInput = this.validaInput(Inputs);
				const arrInputWeight = this.toArrayTensor(objJSON[index].arrInputWeight);
				const matrixHiddenWeight = this.toMatrixTensor(objJSON[index].matrixHiddenWeight);
				const Bias = objJSON[index].Bias;
				const Activation = objJSON[index].Activation;
				const hiddenLayers = objJSON[index].hiddenLayers;
				const dense = objJSON[index].dense;

				let tfProd = [];
				if(dense) {
					for(let x=0; x<arrInput.length; x++) {
						let sumProd = 0;
						for(let y=0; y<arrInputWeight.length; y++) {
							sumProd += Number(arrInput[x].mul(arrInputWeight[y]).arraySync());
						}
						tfProd.push(tf.tensor(Number(sumProd)));
					}

					for(let x=0; x<hiddenLayers; x++) {
						for(let y=0; y<arrInput.length; y++) {
							tfProd[y] = tfProd[y].mul(matrixHiddenWeight[y][x]);
						}
					}
				}else {
					for(let x=0; x<arrInput.length; x++) {
						tfProd.push(arrInput[x].mul(arrInputWeight[x]));
					}

					for(let x=0; x<arrInput.length; x++) {
						for(let y=0; y<hiddenLayers; y++) {
							tfProd[x] = tfProd[x].mul(matrixHiddenWeight[x][y]);
						}
					}			
				}
				let sum = tf.scalar(0);
				for(let x=0; x<arrInput.length; x++) {
					sum = sum.add(tfProd[x]);
				}
				sum.add(tf.scalar(Bias));

				let tfOutput = this.funcaoAtivacao(sum, Activation);
				result.push(tfOutput.arraySync()[0]);

				arrSub.shift();
			}
			return tf.tensor(result).reverse().arraySync();
		}else {
			return result;
		}
	}
}

const net = new NeuralNetwork();

const configFit = {
	epochs: 400, 
	activation: 'sigmoid', 
	bias: 0, 
	hiddenLayers: 1, 
	model: 'dados07',
	dense: true
};

const configPredict = {
	model: 'dados07'
};

const x = [[0, 0], [0, 1], [1, 0], [1, 1]];
const y = [[0], [1], [1], [0]];

//net.fit(x, y, configFit);

console.log(`0 XOR 0 = ${parseFloat(net.predict([0, 0], configPredict)).toFixed(0)}`);
console.log(`0 XOR 1 = ${parseFloat(net.predict([0, 1], configPredict)).toFixed(0)}`);
console.log(`1 XOR 0 = ${parseFloat(net.predict([1, 0], configPredict)).toFixed(0)}`);
console.log(`1 XOR 1 = ${parseFloat(net.predict([1, 1], configPredict)).toFixed(0)}`);
