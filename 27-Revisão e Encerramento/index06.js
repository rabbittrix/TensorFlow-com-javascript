const tf = require('@tensorflow/tfjs');
require('tfjs-node-save');

(async() => {
	const model = tf.sequential();
	model.add(tf.layers.dense({inputShape: [1], units: 1, activation: 'linear'}));
	model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

	const x = tf.tensor([[1], [2], [3], [4]]);
	const y = tf.tensor([[9], [18], [27], [36]]);
	const z = tf.tensor([[5], [6], [7], [8]]);

	await model.fit(x, y, {epochs: 1500});

	let output = await model.predict(z).round();
	output.print();

	await model.save('file://./models/model-linear');
})();
