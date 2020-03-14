$('#result').text('');

function executar() {
	let txt = '';

	const tfdata1 = tf.tensor([1, 2, 3, 4]);
	const tfdata2 = tf.tensor([[1, 2], [3, 4]]);
	const tfdata3 = tf.scalar(2);
	const dataSync1 = tfdata1.dataSync();
	const dataSync2 = tfdata2.dataSync();
	const dataSync3 = tfdata3.dataSync();

	const tfarray1 = tf.tensor([1, 2, 3, 4]);
	const tfarray2 = tf.tensor([[1, 2], [3, 4]]);
	const tfarray3 = tf.scalar(2);
	const arraySync1 = tfarray1.arraySync();
	const arraySync2 = tfarray2.arraySync();
	const arraySync3 = tfarray3.arraySync();

	txt += 'dataSync:\n\n';
	txt += 'ANTES:\n';
	txt += tfdata1.toString() + '\n\n';
	txt += tfdata2.toString() + '\n\n';
	txt += tfdata3.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += '[' + dataSync1.toString() + ']\n\n';
	txt += '[' + dataSync2.toString() + ']\n\n';
	txt += '[' + dataSync3.toString() + ']\n\n';

	txt += 'arraySync:\n\n';
	txt += 'ANTES:\n';
	txt += tfarray1.toString() + '\n\n';
	txt += tfarray2.toString() + '\n\n';
	txt += tfarray3.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += JSON.stringify(arraySync1) + '\n\n';
	txt += JSON.stringify(arraySync2) + '\n\n';
	txt += JSON.stringify(arraySync3) + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
