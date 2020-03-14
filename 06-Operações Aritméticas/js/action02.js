$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([1, 2, 3, 4]);
	const tensor2 = tf.tensor([0, 5, 1, 3]);
	const maximum = tensor1.maximum(tensor2);

	const tensor3 = tf.tensor([1, 2, 3, 4]);
	const tensor4 = tf.tensor([0, 5, 1, 3]);
	const minimum = tensor3.minimum(tensor4);

	const tensor5 = tf.tensor([8, 9, 7, 5]);
	const tensor6 = tf.tensor([2, 3, 2, 2]);
	const mod = tensor5.mod(tensor6);

	const tensor7 = tf.tensor([2, 3]);
	const tensor8 = tf.tensor([3, 2]);
	const pow = tensor7.pow(tensor8);

	const tensor9 = tf.tensor([2, 7]);
	const tensor10 = tf.tensor([1, 2]);
	const squaredDifference = tensor9.squaredDifference(tensor10);

	txt += 'maximum:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += maximum.toString() + '\n\n';

	txt += 'minimum:\n\n';
	txt += 'ANTES:\n';
	txt += tensor3.toString() + '\n\n';
	txt += tensor4.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += minimum.toString() + '\n\n';

	txt += 'mod:\n\n';
	txt += 'ANTES:\n';
	txt += tensor5.toString() + '\n\n';
	txt += tensor6.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += mod.toString() + '\n\n';

	txt += 'pow:\n\n';
	txt += 'ANTES:\n';
	txt += tensor7.toString() + '\n\n';
	txt += tensor8.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += pow.toString() + '\n\n';

	txt += 'squaredDifference:\n\n';
	txt += 'ANTES:\n';
	txt += tensor9.toString() + '\n\n';
	txt += tensor10.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += squaredDifference.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
