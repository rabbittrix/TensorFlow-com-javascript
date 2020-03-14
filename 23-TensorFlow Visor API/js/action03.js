let primeiraVEZ = true;

async function exibir() {
	const model = tf.sequential({
		layers: [
			tf.layers.dense({inputShape: [2], units: 4, activation: 'sigmoid'}),
			tf.layers.dense({inputShape: [4], units: 1, activation: 'sigmoid'})
		]
	});

	const tela = {tab: 'Estatísticas das Camadas', name: 'Distribuição de Dados'};
	await tfvis.show.layer(tela, model.getLayer(undefined, 0));
	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
