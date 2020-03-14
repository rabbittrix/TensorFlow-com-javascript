let primeiraVEZ = true;

async function exibir() {
	const model = tf.sequential({
		layers: [
			tf.layers.dense({inputShape: [2], units: 4, activation: 'sigmoid'}),
			tf.layers.dense({inputShape: [4], units: 1, activation: 'sigmoid'})
		]
	});

	model.compile({
		optimizer: tf.train.rmsprop(0.5),
		loss: 'meanSquaredError',
		metrics: ['accuracy']
	});

	const data = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const labels = tf.tensor([[0], [0], [0], [1]]);

	const tela = {tab: 'Treinamento', name: 'Histórico de Treinamento'};
	const history = await model.fit(data, labels, {epochs: 100});

	tfvis.show.history(tela, history, ['loss', 'acc']);
	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
