$('#result').text('');

async function executar() {
	let txt = '';

	const labels      = tf.tensor([0, 0, 0, 1, 2, 3, 4, 5, 6, 7]);
	const predictions = tf.tensor([0, 0, 1, 1, 2, 3, 0, 0, 0, 0]);

	const acuracia = await tfvis.metrics.accuracy(labels, predictions);

	txt += 'accuracy:\n\n';
	txt += labels.toString() + '\n\n';
	txt += predictions.toString() + '\n\n';
	txt += acuracia.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
