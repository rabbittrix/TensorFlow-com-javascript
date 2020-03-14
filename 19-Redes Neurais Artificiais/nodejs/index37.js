const tf = require('@tensorflow/tfjs');

async function NeuralNetwork() {
	let model = null;

	const x = tf.tensor([[1], [0]]);
	const y = tf.tensor([[0], [1]]);
	const z = tf.tensor([[1], [0]]);

	let input = tf.math.confusionMatrix(x.flatten(), z.flatten(), 2);
	input = input.flatten().reshape([4, 1]);

	console.log('ANTES:');
	input.print();

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

	let output = model.predict(input).round();
	console.log('DEPOIS:');
	output.print();
}

NeuralNetwork();
