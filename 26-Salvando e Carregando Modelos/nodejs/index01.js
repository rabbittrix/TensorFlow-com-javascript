const tf = require('@tensorflow/tfjs');
require('tfjs-node-save');
let model = tf.sequential();

async function treinar() {
	model.add(tf.layers.dense({inputShape: [2], units: 1, activation: 'sigmoid'}));
	model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.sgd(.05)});

	const x = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const y = tf.tensor([[0], [1], [1], [1]]);

	let epochs = 1000;
	for(let i=1; i<=epochs; i++) {
		await model.fit(x, y);
	}
	await salvar();
}

async function salvar() {
	const salvo = await model.save('file://./models/model-or');
	if(salvo) console.log('modelo salvo com sucesso.');
}

treinar();
