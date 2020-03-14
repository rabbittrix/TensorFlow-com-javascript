$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([1, 2, 3, 4]);
	const tensor2 = tf.tensor([10, 20, 30, 40]);
	const add = tensor1.add(tensor2);

	const tensor3 = tf.tensor([10, 20, 30, 40]);
	const tensor4 = tf.tensor([1, 2, 3, 4]);
	const sub = tensor3.sub(tensor4);

	const tensor5 = tf.tensor([1, 2, 3, 4]);
	const tensor6 = tf.tensor([1, 4, 5, 4]);
	const mul = tensor5.mul(tensor6);

	const tensor7 = tf.tensor([7, 8, 15, 40]);
	const tensor8 = tf.tensor([2, 2, 3, 2]);
	const div = tensor7.div(tensor8);

	const tensor9 = tf.tensor([7, 8, 15, 40]);
	const tensor10 = tf.tensor([2, 2, 3, 2]);
	const floorDiv = tensor9.floorDiv(tensor10);

	const tensor11 = tf.tensor([1, 3]);
	const tensor12 = tf.tensor([2, 4]);
	const tensor13 = tf.tensor([1, 1]);
	const addN = tf.addN([tensor11, tensor12, tensor13]);

	txt += 'add:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += add.toString() + '\n\n';

	txt += 'sub:\n\n';
	txt += 'ANTES:\n';
	txt += tensor3.toString() + '\n\n';
	txt += tensor4.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += sub.toString() + '\n\n';

	txt += 'mul:\n\n';
	txt += 'ANTES:\n';
	txt += tensor5.toString() + '\n\n';
	txt += tensor6.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += mul.toString() + '\n\n';

	txt += 'div:\n\n';
	txt += 'ANTES:\n';
	txt += tensor7.toString() + '\n\n';
	txt += tensor8.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += div.toString() + '\n\n';

	txt += 'floorDiv:\n\n';
	txt += 'ANTES:\n';
	txt += tensor9.toString() + '\n\n';
	txt += tensor10.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += floorDiv.toString() + '\n\n';

	txt += 'addN:\n\n';
	txt += 'ANTES:\n';
	txt += tensor11.toString() + '\n\n';
	txt += tensor12.toString() + '\n\n';
	txt += tensor13.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += addN.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
