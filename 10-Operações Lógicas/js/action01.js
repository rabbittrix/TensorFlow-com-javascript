$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([1, 2, 3, 4]);
	const tensor2 = tf.tensor([1, 0, 3, 5]);
	const equal = tensor1.equal(tensor2); // true para valores iguais

	const tensor3 = tf.tensor([1, 2, 3, 7]);
	const tensor4 = tf.tensor([1, 0, 3, 5]);
	const greater = tensor3.greater(tensor4); // true para valores maiores

	const tensor5 = tf.tensor([0, 2, 3, 7]);
	const tensor6 = tf.tensor([1, 0, 3, 5]);
	const greaterEqual = tensor5.greaterEqual(tensor6); // true para valores maiores ou iguais

	const tensor7 = tf.tensor([1, 2, 1, 7]);
	const tensor8 = tf.tensor([1, 0, 3, 5]);
	const less = tensor7.less(tensor8); // true para valores menores

	const tensor9 = tf.tensor([1, 2, 1, 7]);
	const tensor10 = tf.tensor([1, 0, 3, 5]);
	const lessEqual = tensor9.lessEqual(tensor10); // true para valores menores ou iguais

	txt += 'equal:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += equal.toString() + '\n\n';

	txt += 'greater:\n\n';
	txt += 'ANTES:\n';
	txt += tensor3.toString() + '\n\n';
	txt += tensor4.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += greater.toString() + '\n\n';

	txt += 'greaterEqual:\n\n';
	txt += 'ANTES:\n';
	txt += tensor5.toString() + '\n\n';
	txt += tensor6.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += greaterEqual.toString() + '\n\n';

	txt += 'less:\n\n';
	txt += 'ANTES:\n';
	txt += tensor7.toString() + '\n\n';
	txt += tensor8.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += less.toString() + '\n\n';

	txt += 'lessEqual:\n\n';
	txt += 'ANTES:\n';
	txt += tensor9.toString() + '\n\n';
	txt += tensor10.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += lessEqual.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
