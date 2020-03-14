$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([1, 2, 3, 4]);
	const pad = tensor1.pad([[1, 2]]);

	const tensor2 = tf.tensor([1, 2]);
	const tensor3 = tf.tensor([3, 4]);
	const concat = tensor2.concat(tensor3);
	//const concat = tensor2.concat([tensor2, tensor3]);

	const tensor4 = tf.tensor([1, 2]);
	const tensor5 = tf.tensor([3, 4]);
	const stack = tf.stack([tensor4, tensor5]);

	const tensor6 = tf.tensor([1, 2, 3, 4], [2, 2]);
	const reverse = tensor6.reverse();

	const tensor7 = tf.tensor([1, 2, 3, 4, 5, 6, 7, 8], [2, 4]);
	const [tensor8, tensor9] = tf.split(tensor7, 2, 1);

	const tensor10 = tf.tensor([1, 2]);
	const tile = tensor10.tile([4]);

	txt += 'pad:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += pad.toString() + '\n\n';

	txt += 'concat:\n\n';
	txt += 'ANTES:\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += concat.toString() + '\n\n';

	txt += 'stack:\n\n';
	txt += 'ANTES:\n';
	txt += tensor4.toString() + '\n\n';
	txt += tensor5.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += stack.toString() + '\n\n';

	txt += 'reverse:\n\n';
	txt += 'ANTES:\n';
	txt += tensor6.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += reverse.toString() + '\n\n';

	txt += 'split:\n\n';
	txt += 'ANTES:\n';
	txt += tensor7.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += tensor8.toString() + '\n\n';
	txt += tensor9.toString() + '\n\n';

	txt += 'tile:\n\n';
	txt += 'ANTES:\n';
	txt += tensor10.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += tile.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
