const tf = require('@tensorflow/tfjs');

(async() => {
	const input1 = tf.input({shape: [2]});
	const inputLayer = tf.layers.dense({units: 4, activation: 'sigmoid'});
	inputLayer.apply(input1);

	const input2 = tf.input({shape: [4]});
	const hiddenLayer = tf.layers.dense({units: 1, activation: 'sigmoid'});
	hiddenLayer.apply(input2);

	const model = tf.sequential({layers: [inputLayer, hiddenLayer]});
	model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.5)});

	const x = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const y = tf.tensor([[0], [1], [1], [0]]);
	const z = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);

	await model.fit(x, y, {epochs: 2500});

	let output = await model.predict(z).round();
	output.print();
})();
