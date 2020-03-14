const tf = require('@tensorflow/tfjs');

async function NeuralNetwork() {
	const model = tf.sequential();
	model.add(tf.layers.dense({units: 2, inputShape: [2], activation: 'tanh'}));
	model.add(tf.layers.dense({units: 1, inputShape: [2], activation: 'sigmoid'}));
	model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.rmsprop(.05)});

	const x = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const y = tf.tensor([[0], [1], [1], [0]]);
	const z = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);

	for(let i=1; i<=1000; i++) {
		let train = await model.fit(x, y);
		if(i%10==0)
			console.log(`taxa de erro: ${parseFloat(train.history.loss[0]).toFixed(4)}`);
	}

	let output = model.predict(z).round();
	output.print();
}

NeuralNetwork();
