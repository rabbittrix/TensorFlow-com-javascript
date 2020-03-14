const tf = require('@tensorflow/tfjs');
require('tfjs-node-save');

(async() => {
	const model = await tf.loadLayersModel('file://./models/model-linear/model.json');

	const z = tf.tensor([[5], [6], [7], [8]]);
	let output = await model.predict(z).round();
	output.print();
})();
