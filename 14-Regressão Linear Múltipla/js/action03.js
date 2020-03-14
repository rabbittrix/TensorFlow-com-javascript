$('#result').text('');

function exibir(str='') {
	$('#result').text(str);
}

function executar() {
	exibir('...processando.');
	let txt = '';

	const model = tf.sequential();
	const inputLayer = tf.layers.dense({units: 2, inputShape: [3]});
	model.add(inputLayer);
	model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

	const x = tf.tensor([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [3, 3]);
	const y = tf.tensor([[3, 5], [9, 11], [15, 17]]);
	const input = tf.tensor([[10, 11, 12]], [1, 3]);

	model.fit(x, y, {epochs: 500}).then(() => {
		let output = model.predict(input).dataSync();
		output = converteArray(output);
		let z = tf.tensor(output);

		txt += 'Regressão Linear Múltipla com Rede Neural:\n';
		txt += 'TREINAMENTO:\n';
		txt += x.toString() + '\n\n';
		txt += y.toString() + '\n\n';
		txt += 'ENTRADA:\n';
		txt += input.toString() + '\n\n';
		txt += 'SAIDA:\n\n';
		txt += z.toString() + '\n\n';
		exibir(txt);
	});
}

function converteArray(array) {
	let result = [];
	for(let i=0; i<array.length; i++) {
		result.push(Number(array[i].toFixed(0)));
	}
	return result;
}
