const tf = require('@tensorflow/tfjs');

(async() => {
	const model = tf.sequential();
	model.add(tf.layers.dense({inputShape: [2], units: 1, activation: 'sigmoid'}));
	model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.5)});

	const x = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const y = tf.tensor([[0], [0], [0], [1]]);
	const z = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);

	await model.fit(x, y, {epochs: 2000});

	let output = await model.predict(z).round();
	output.print();
})();
