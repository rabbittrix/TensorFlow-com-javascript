const tf = require('@tensorflow/tfjs');

(async() => {
	const model = tf.sequential();
	model.add(tf.layers.dense({inputShape: [2], units: 1, activation: 'linear'}));
	model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

	const x = tf.tensor([[1, 2], [3, 4], [5, 6], [7, 8]]);
	const y = tf.tensor([[3], [7], [11], [15]]);
	const z = tf.tensor([[5, 1], [3, 2], [7, 3], [8, 2]]);

	await model.fit(x, y, {epochs: 3000});

	let output = await model.predict(z).round();
	output.print();
})();
