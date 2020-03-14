$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([true, true, true]);
	//const tensor1 = tf.tensor([true, false, true]);
	//const all = tensor1.all();
	const all = tf.all(tensor1); // verifica se todos os elementos são diferentes de false

	const tensor2 = tf.tensor([1, 2, 3, 4]);
	const max = tensor2.max(); // maior elemento

	const tensor3 = tf.tensor([1, 2, 3, 4]);
	const min = tensor3.min(); // menor elemento

	const tensor4 = tf.tensor([1, 2, 3, 4]);
	const mean = tensor4.mean(); // média dos elementos

	const tensor5 = tf.tensor([1, 2, 3, 4]);
	const prod = tensor5.prod(); // produto dos elementos

	const tensor6 = tf.tensor([1, 2, 3, 4]);
	const sum = tensor6.sum(); // soma dos elementos

	txt += 'all:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += all.toString() + '\n\n';

	txt += 'max:\n\n';
	txt += 'ANTES:\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += max.toString() + '\n\n';

	txt += 'min:\n\n';
	txt += 'ANTES:\n';
	txt += tensor3.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += min.toString() + '\n\n';

	txt += 'mean:\n\n';
	txt += 'ANTES:\n';
	txt += tensor4.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += mean.toString() + '\n\n';

	txt += 'prod:\n\n';
	txt += 'ANTES:\n';
	txt += tensor5.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += prod.toString() + '\n\n';

	txt += 'sum:\n\n';
	txt += 'ANTES:\n';
	txt += tensor6.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += sum.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
