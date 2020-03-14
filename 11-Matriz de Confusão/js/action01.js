$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([1, 2, 1]);
	const tensor2 = tf.tensor([1, 2, 1]);
	const confusionMatrix = tf.math.confusionMatrix(tensor1, tensor2, 4);

	txt += 'confusionMatrix:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += confusionMatrix.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
