let img = tf.tensor([0]);
let primeiraVEZ = true;

async function capturar() {
	$('#cam').text('... processando, aguarde.');
	const elemento = document.createElement('video');
	elemento.width = 100;
	elemento.height = 100;
	const interacao = await tf.data.webcam(elemento);
	img = await interacao.capture();
	img.print();
	interacao.stop();
	$('#cam').text('Capturar WebCAM');
}

async function exibir() {
	const tensor = img; //tf.tensor([0, 0.1, 0.2, 0.3, 2, 3, 3.1, 4, 4.1, 4.2]);
	const tela = {tab: 'Estatísticas do Tensor', name: 'Distribuição de Dados'};
	await tfvis.show.valuesDistribution(tela, tensor);
	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
