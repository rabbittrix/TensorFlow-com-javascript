const tf = require('@tensorflow/tfjs');

async function NeuralNetwork() {
	let model = null;

	const x = tf.tensor([[1], [2], [3], [4]]);
	const y = tf.tensor([[9], [18], [27], [36]]);
	const z = tf.tensor([[5], [6], [7], [8]]);

	let taxa = 1;
	while(taxa>0.1) {
		model = tf.sequential();
		model.add(tf.layers.dense({units: 1, inputShape: [1]}));
		model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.rmsprop(.05)});

		for(let i=1; i<=1000; i++) {
			let train = await model.fit(x, y);
			taxa = parseFloat(train.history.loss[0]).toFixed(4);
		}
	}

	let output = model.predict(z).round();
	output.print();
}

NeuralNetwork();
