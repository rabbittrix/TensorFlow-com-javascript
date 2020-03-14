const tf = require('@tensorflow/tfjs');
require('tfjs-node-save');

(async() => {
	let model = await tf.loadLayersModel('file://./models/model-or/model.json');
	let input = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	await model.predict(input).round().print();
})();
