$('#result').text('');

function exibir(str='') {
	$('#result').text(str);
}

function executar() {
	exibir('...processando.');
	let txt = '';

	const model = tf.sequential();
	model.add(tf.layers.dense({units: 1, inputShape: [1]}));
	model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

	const x = tf.tensor([1, 2, 3, 4], [4, 1]);
	const y = tf.tensor([[10], [20], [30], [40]]);
	const input = tf.tensor([5, 6, 7], [3, 1]);

	model.fit(x, y, {epochs: 550}).then(() => {
		let output = model.predict(input).dataSync();
		output = converteArray(output);
		let z = tf.tensor(output);

		txt += 'Regressão Linear Simples com Rede Neural:\n';
		txt += 'TREINAMENTO:\n';
		txt += x.flatten().toString() + '\n\n';
		txt += y.flatten().toString() + '\n\n';
		txt += 'ENTRADA:\n';
		txt += input.flatten().toString() + '\n\n';
		txt += 'SAIDA:\n\n';
		txt += z.toString() + '\n\n';
		exibir(txt);
	});
}

function converteArray(array) {
	let result = [];
	for(let i=0; i<array.length; i++) {
		result.push(Math.ceil(array[i]));
	}
	return result;
}
