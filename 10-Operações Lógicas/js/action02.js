$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([false, false, true, true]);
	const tensor2 = tf.tensor([false, true, false, true]);
	const logicalAnd = tensor1.logicalAnd(tensor2);

	const tensor3 = tf.tensor([false, false, true, true]);
	const tensor4 = tf.tensor([false, true, false, true]);
	const logicalOr = tensor3.logicalOr(tensor4);

	const tensor5 = tf.tensor([false, false, true, true]);
	const tensor6 = tf.tensor([false, true, false, true]);
	const logicalXor = tensor5.logicalXor(tensor6);

	const tensor7 = tf.tensor([false, false, true, true]);
	const tensor8 = tf.tensor([false, true, false, true]);
	const notEqual = tensor7.notEqual(tensor8);

	const tensor9 = tf.tensor([1, 2.5, 3, 4.5]);
	const tensor10 = tf.tensor([2, 1.5, 3, 4.5]);
	const notEqualNumero = tensor9.notEqual(tensor10);

	txt += 'logicalAnd:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += logicalAnd.toString() + '\n\n';

	txt += 'logicalOr:\n\n';
	txt += 'ANTES:\n';
	txt += tensor3.toString() + '\n\n';
	txt += tensor4.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += logicalOr.toString() + '\n\n';

	txt += 'logicalXor:\n\n';
	txt += 'ANTES:\n';
	txt += tensor5.toString() + '\n\n';
	txt += tensor6.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += logicalXor.toString() + '\n\n';

	txt += 'notEqual:\n\n';
	txt += 'ANTES:\n';
	txt += tensor7.toString() + '\n\n';
	txt += tensor8.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += notEqual.toString() + '\n\n';

	txt += 'notEqual:\n\n';
	txt += 'ANTES:\n';
	txt += tensor9.toString() + '\n\n';
	txt += tensor10.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += notEqualNumero.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
