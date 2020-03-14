$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([-1, 0, 1, 2]);
	const tanh = tensor1.tanh(); // tangente hiperbólica (-1, 1)

	const tensor2 = tf.tensor([-1, 0, 1, 2]);
	const sigmoid = tensor2.sigmoid(); // função sigmóide (0, 1)

	const tensor3 = tf.tensor([-1, 0, 1, 2]);
	const relu = tensor3.relu(); // função relu (transforma números negativos em 0)

	const tensor4 = tf.tensor([-1, 0, 1, 2]);
	const leakyRelu = tensor4.leakyRelu(); // função leaky relu (divide números menores que 0 por 5)

	const tensor5 = tf.tensor([-1, 0, 1, 2]);
	const softmax = tensor5.softmax(); // função softmax (0, 1)

	const tensor6 = tf.tensor([-1, 0, 1, 2]);
	const softplus = tensor6.softplus(); // função softplus (coloca números negativos entre 0 e 1)

	txt += 'tanh:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += tanh.toString() + '\n\n';

	txt += 'sigmoid:\n\n';
	txt += 'ANTES:\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += sigmoid.toString() + '\n\n';

	txt += 'relu:\n\n';
	txt += 'ANTES:\n';
	txt += tensor3.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += relu.toString() + '\n\n';

	txt += 'leakyRelu:\n\n';
	txt += 'ANTES:\n';
	txt += tensor4.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += leakyRelu.toString() + '\n\n';

	txt += 'softmax:\n\n';
	txt += 'ANTES:\n';
	txt += tensor5.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += softmax.toString() + '\n\n';

	txt += 'softplus:\n\n';
	txt += 'ANTES:\n';
	txt += tensor6.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += softplus.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
