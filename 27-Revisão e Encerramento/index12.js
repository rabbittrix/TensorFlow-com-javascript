const tf = require('@tensorflow/tfjs');

(async() => {
	const model = tf.sequential();

	const x = tf.tensor([[[2], [4], [6], [8]]]);
	const y = tf.tensor([[[10], [12], [14], [16]]]);

	const rnn = tf.layers.simpleRNN({inputShape: [4, 1], units: 1, returnSequences: true, activation: 'linear'});

	model.add(rnn);
	model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.005)});

	await model.fit(x, y, {epochs: 4000});

	const input = tf.tensor([[[4], [6], [8], [10]]]);
	const output = await model.predict(input).round();
	output.print();	
})();
