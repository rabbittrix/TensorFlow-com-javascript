$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([1, 2, 3, 4]);
	const tensor2 = tf.tensor([[1, 2], [3, 4]]);
	const tensor3 = tf.tensor([0, 1, 2, 3], [2, 2]);

	tf.tensor([1, 2, 3, 4]).print();
	tf.tensor([[1, 2], [3, 4]]).print();
	tf.tensor([0, 1, 2, 3], [2, 2]).print();

	tensor1.print();
	tensor2.print();
	tensor3.print();

	txt += 'Tensor Padrão de 1 Dimensão: \n' + tensor1.toString() + '\n\n';
	txt += 'Tensor Padrão de 2 Dimensões: \n' + tensor2.toString() + '\n\n';
	txt += 'Tensor Padrão com Dimensionalidade: \n' + tensor3.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
