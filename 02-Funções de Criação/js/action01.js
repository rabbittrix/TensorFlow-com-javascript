$('#result').text('');

function executar() {
	let txt = '';

	const fill0 = tf.fill([1], 0);
	const fill1 = tf.fill([2, 2], 1);
	const fill2 = tf.fill([2, 2], 2);

	const zeros1 = tf.zeros([1]);
	const zeros2 = tf.zeros([2, 2]);
	const zeros3 = tf.zeros([2, 4]);

	const ones1 = tf.ones([1]);
	const ones2 = tf.ones([2, 2]);
	const ones3 = tf.ones([2, 4]);

	const linspace1 = tf.linspace(0, 9, 10);
	const linspace2 = tf.linspace(1, 10, 10);
	const linspace3 = tf.linspace(1, 15, 15);

	const range1 = tf.range(1, 11, 1);
	const range2 = tf.range(0, 21, 2);
	const range3 = tf.range(0, 101, 10);

	txt += 'fill:\n\n';
	txt += fill0.toString() + '\n\n';
	txt += fill1.toString() + '\n\n';
	txt += fill2.toString() + '\n\n';

	txt += 'zeros:\n\n';
	txt += zeros1.toString() + '\n\n';
	txt += zeros2.toString() + '\n\n';
	txt += zeros3.toString() + '\n\n';

	txt += 'ones:\n\n';
	txt += ones1.toString() + '\n\n';
	txt += ones2.toString() + '\n\n';
	txt += ones3.toString() + '\n\n';

	txt += 'linspace:\n\n';
	txt += linspace1.toString() + '\n\n';
	txt += linspace2.toString() + '\n\n';
	txt += linspace3.toString() + '\n\n';

	txt += 'range:\n\n';
	txt += range1.toString() + '\n\n';
	txt += range2.toString() + '\n\n';
	txt += range3.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
