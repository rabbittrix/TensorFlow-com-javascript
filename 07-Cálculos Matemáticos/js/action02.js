$('#result').text('');

function executar() {
	let txt = '';

	const tensor1 = tf.tensor([1, 2]);
	const exp = tensor1.exp(); // eleva a constante de euler aos elementos do tensor

	const tensor2 = tf.tensor([1, 2]);
	const expm1 = tensor1.expm1(); // eleva a constante de euler aos elementos do tensor menos 1

	const tensor3 = tf.tensor([1, 2]);
	const log = tensor3.log(); // logaritmo natural na base e

	const tensor4 = tf.tensor([-1, 2]);
	const neg = tensor4.neg(); // inverte os sinais

	const tensor5 = tf.tensor([1.2, 2.5, 3.8]);
	const round = tensor5.round(); // arredonda para a casa mais próxima

	const tensor6 = tf.tensor([9, 25]);
	const rsqrt = tensor6.rsqrt(); // 1 dividido pela raiz quadrada do elemento

	const tensor7 = tf.tensor([-1, 2, -3, 0]);
	const sign = tensor7.sign(); // -1 para negativo, 1 para positivo e 0 para 0

	const tensor8 = tf.tensor([1, -1]);
	const sin = tensor8.sin(); // seno

	const tensor9 = tf.tensor([1, -1]);
	const sinh = tensor9.sinh(); // seno hiperbólico

	const tensor10 = tf.tensor([9, 25, 49, 100]);
	const sqrt = tensor10.sqrt(); // raiz quadrada

	const tensor11 = tf.tensor([1, 2, 3, 4, 5]);
	const square = tensor11.square(); // quadrado

	const tensor12 = tf.tensor([1, 2, 3, 4, 5]);
	const tan = tensor12.tan(); // tangente

	txt += 'exp:\n\n';
	txt += 'ANTES:\n';
	txt += tensor1.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += exp.toString() + '\n\n';

	txt += 'expm1:\n\n';
	txt += 'ANTES:\n';
	txt += tensor2.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += expm1.toString() + '\n\n';

	txt += 'log:\n\n';
	txt += 'ANTES:\n';
	txt += tensor3.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += log.toString() + '\n\n';

	txt += 'neg:\n\n';
	txt += 'ANTES:\n';
	txt += tensor4.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += neg.toString() + '\n\n';

	txt += 'round:\n\n';
	txt += 'ANTES:\n';
	txt += tensor5.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += round.toString() + '\n\n';

	txt += 'rsqrt:\n\n';
	txt += 'ANTES:\n';
	txt += tensor6.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += rsqrt.toString() + '\n\n';

	txt += 'sign:\n\n';
	txt += 'ANTES:\n';
	txt += tensor7.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += sign.toString() + '\n\n';

	txt += 'sin:\n\n';
	txt += 'ANTES:\n';
	txt += tensor8.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += sin.toString() + '\n\n';

	txt += 'sinh:\n\n';
	txt += 'ANTES:\n';
	txt += tensor9.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += sinh.toString() + '\n\n';

	txt += 'sqrt:\n\n';
	txt += 'ANTES:\n';
	txt += tensor10.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += sqrt.toString() + '\n\n';

	txt += 'square:\n\n';
	txt += 'ANTES:\n';
	txt += tensor11.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += square.toString() + '\n\n';

	txt += 'tan:\n\n';
	txt += 'ANTES:\n';
	txt += tensor12.toString() + '\n\n';
	txt += 'DEPOIS:\n';
	txt += tan.toString() + '\n\n';

	exibir(txt);
}

function exibir(str='') {
	$('#result').text(str);
}
