$('#result').text('');

function executar() {
	let txt = '';

	const randomNormal = tf.randomNormal([2, 2]);

	const randomUniform = tf.randomUniform([2, 2], 0, 1);

	txt += 'randomNormal:\n\n';
	txt += randomNormal.toString() + '\n\n';

	txt += 'randomUniform:\n\n';
	txt += randomUniform.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
