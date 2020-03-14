$('#result').text('');

function executar() {
	let txt = '';

	const int32 = tf.tensor2d([1, 2, 3, 4], [2, 2], 'int32');
	const float32 = tf.tensor2d([1.5, 2.7, 3.1, 4.8], [2, 2], 'float32');
	const bool = tf.tensor2d([true, false, true, false], [2, 2], 'bool');
	const string = tf.tensor2d(['aaa', 'bbb', 'ccc', 'ddd'], [2, 2], 'string');

	txt += 'Tensor do Tipo int32: \n' + int32.toString() + '\n\n';
	txt += 'Tensor do Tipo float32: \n' + float32.toString() + '\n\n';
	txt += 'Tensor do Tipo bool: \n' + bool.toString() + '\n\n';
	txt += 'Tensor do Tipo string: \n' + string.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
