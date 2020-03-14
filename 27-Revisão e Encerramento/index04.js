const tf = require('@tensorflow/tfjs');

(async() => {
	const model = tf.sequential();
	model.add(tf.layers.dense({inputShape: [1], units: 1, activation: 'sigmoid'}));
	model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

	const x = tf.tensor([[0], [1]]);
	const y = tf.tensor([[1], [0]]);
	const z = tf.tensor([[0], [1]]);

	await model.fit(x, y, {epochs: 1500});

	let output = await model.predict(z).round();
	output.print();
})();
