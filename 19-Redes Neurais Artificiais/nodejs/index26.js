const tf = require('@tensorflow/tfjs');

async function NeuralNetwork() {
	const model = tf.sequential();
	model.add(tf.layers.dense({units: 1, inputShape: [1], activation: 'sigmoid'}));
	model.compile({loss: tf.losses.logLoss, optimizer: 'sgd'});

	const x = tf.tensor([[0], [1]]);
	const y = tf.tensor([[1], [0]]);
	const z = tf.tensor([[0], [1]]);

	await model.fit(x, y, {epochs: 750});

	let output = model.predict(z).round();
	output.print();
}

NeuralNetwork();
