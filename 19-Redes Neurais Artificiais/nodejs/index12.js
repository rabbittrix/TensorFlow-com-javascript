const tf = require('@tensorflow/tfjs');

const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

const x = tf.tensor([[1], [2], [3], [4]]);
const y = tf.tensor([[0], [1], [2], [3]]);
const z = tf.tensor([[5]]);

model.fit(x, y, {epochs: 750}).then(() => {
	let output = model.predict(z).round();
	output.print();
});
