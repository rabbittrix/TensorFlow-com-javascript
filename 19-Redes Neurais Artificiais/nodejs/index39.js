const tf = require('@tensorflow/tfjs');

async function NeuralNetwork() {
	let model = null;

	const x = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const y = tf.tensor([[0], [1], [1], [0]]);
	const z = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);

	let taxa = 1;
	while(taxa>0.1) {
		const input = tf.input({shape: [2]});
		const dense1 = tf.layers.dense({units: 2, activation: 'tanh'}).apply(input);
		const dense2 = tf.layers.dense({units: 1, activation: 'sigmoid'}).apply(dense1);
		model = tf.model({inputs: input, outputs: dense2});

		model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.rmsprop(.05)});

		for(let i=1; i<=1000; i++) {
			let train = await model.fit(x, y);
			taxa = parseFloat(train.history.loss[0]).toFixed(4);
			if(i%10==0) console.log(`taxa de erro: ${taxa}`);
			if(taxa==0) {
				i=1001;
				console.log(`taxa de erro: 0.0000`);
			}
		}
	}

	let output = model.predict(z).round();
	output.print();
}

NeuralNetwork();
