$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([false, false, false, false, false, false, false, true, true, true]);
	const tensor2 = tf.tensor([false, false, false, false, true, true, true, false, false, true]);
	const confusionMatrix = tf.math.confusionMatrix(tensor1, tensor2, 2);

	txt += 'confusionMatrix:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += confusionMatrix.flatten().toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
