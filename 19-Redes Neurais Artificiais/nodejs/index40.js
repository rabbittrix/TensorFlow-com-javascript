const tf = require('@tensorflow/tfjs');

async function NeuralNetwork() {
	let model = null;

	const x = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const y = tf.tensor([[0], [1], [1], [0]]);
	const z = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);

	let taxa = 1;
	while(taxa>0.1) {
		model = tf.sequential();
		model.add(tf.layers.dense({units: 2, inputShape: [2], activation: 'tanh', useBias: true}));
		model.add(tf.layers.dense({units: 1, inputShape: [2], activation: 'sigmoid', useBias: true}));
		model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.rmsprop(.05)});

		for(let i=1; i<=1000; i++) {
			let train = await model.fit(x, y);
			taxa = parseFloat(train.history.loss[0]).toFixed(4);
			if(i%10==0) console.log(`taxa de erro: ${taxa}`);
			if(taxa==0) i=1001;
		}
	}

	console.log('----------------------------------------------------------');
	model.weights.forEach(w => {
		console.log(`nome do peso: ${w.name} - dimensionalidade: ${w.shape}`);
	});
	console.log('----------------------------------------------------------');

	let output = model.predict(z).round();
	output.print();
}

NeuralNetwork();
