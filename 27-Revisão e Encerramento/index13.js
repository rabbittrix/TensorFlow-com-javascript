const tf = require('@tensorflow/tfjs');

(async() => {
	const model = tf.sequential();
	const configInput = {
		units: 1, 
		activation: 'sigmoid'
	};
	const input = tf.input({shape: [2]});
	const inputLayer = tf.layers.dense(configInput);
	inputLayer.apply(input);

	model.add(inputLayer);

	const learningRate = .5;
	const optimizer = tf.train.sgd(learningRate);
	const loss = tf.losses.meanSquaredError;
	const configCompile = {loss, optimizer};
	model.compile(configCompile);

	const x = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const y = tf.tensor([[0], [1], [1], [1]]);
	const z = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);

	await model.fit(x, y, {epochs: 2000});

	let output = await model.predict(z).round();
	output.print();
})();
