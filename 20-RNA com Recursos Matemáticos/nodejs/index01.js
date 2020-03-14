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

function Feedforward(Input1=0, Input2=0, Target=0, Epochs=1, Activation='sigmoid', Bias=0) {
	let input1 = Number(Input1);
	if(input1 <= 0) input1 = 0.1;
	let input2 = Number(Input2);
	if(input2 <= 0) input2 = 0.1;
	const tfInput1 = tf.scalar(input1);
	const tfInput2 = tf.scalar(input2);

	const target = Number(Target);
	const tfTarget = tf.scalar(target);
	let tfWeight1 = tf.randomUniform([1, 1]).flatten();
	let tfWeight2 = tf.randomUniform([1, 1]).flatten();
	const epochs = Number(Epochs);

	for(let i=1; i<=epochs; i++) {
		let sum = tfInput1.mul(tfWeight1).add(tfInput2.mul(tfWeight2)).add(tf.scalar(Bias));
		let tfOutput = funcaoAtivacao(sum, Activation);
		let tfError = tfTarget.sub(tfOutput);
		tfWeight1 = tfWeight1.add(tfInput1.mul(derivada(tfError)));
		tfWeight2 = tfWeight2.add(tfInput2.mul(derivada(tfError)));

		let printErro = parseFloat(tfError.abs().arraySync()).toFixed(4);
		let printOutput = parseFloat(tfOutput.arraySync()).toFixed(8);
		console.log(`${i.toString().padEnd(4, ' ')} - taxa de erro: ${printErro} - saída: ${printOutput}`);

		if(corte(target, tfOutput)) i = epochs+1;
	}
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

Feedforward(Input1=0.5, Input2=0.5, Target=0.7, Epochs=100, Activation='softplus', Bias=0);
