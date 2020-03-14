$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([1, 2, 3, 4], [2, 2]);
	const tensor2 = tf.tensor([5, 6, 7, 8], [2, 2]);
	const matMul = tensor1.matMul(tensor2); // multiplicação matricial

	const tensor3 = tf.tensor([1, 2, 3]);
	const tensor4 = tf.tensor([3, 4, 5]);
	const outerProduct = tf.outerProduct(tensor3, tensor4); // cada elemento do um vezes todos do outro

	const tensor5 = tf.tensor([1, 2, 3, 4, 5, 6], [2, 3]); // transforma linhas em colunas
	const transpose = tensor5.transpose();

	txt += 'matMul:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += matMul.toString() + '\n\n';

	txt += 'outerProduct:\n\n';
	txt += 'ANTES:\n';
	txt += tensor3.toString() + '\n\n';
	txt += tensor4.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += outerProduct.toString() + '\n\n';

	txt += 'transpose:\n\n';
	txt += 'ANTES:\n';
	txt += tensor5.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += transpose.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
