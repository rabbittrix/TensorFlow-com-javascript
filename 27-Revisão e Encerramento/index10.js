const tf = require('@tensorflow/tfjs');

(async() => {
	const model = tf.sequential();
	model.add(tf.layers.dense({inputShape: [2], units: 2, activation: 'linear'}));
	model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.05)});

	const x = tf.tensor([[1, 2], [2, 3], [3, 4], [4, 5]]);
	const y = tf.tensor([[1, 3], [2, 5], [3, 7], [4, 9]]);
	const z = tf.tensor([[5, 1], [3, 2], [7, 3], [8, 2]]);

	await model.fit(x, y, {epochs: 8000});

	let output = await model.predict(z).round();
	output.print();
})();
