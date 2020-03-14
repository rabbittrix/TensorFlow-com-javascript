let primeiraVEZ = true;

async function exibir() {
	const model = tf.sequential({
		layers: [
			tf.layers.dense({inputShape: [2], units: 4, activation: 'sigmoid'}),
			tf.layers.dense({inputShape: [4], units: 1, activation: 'sigmoid'})
		]
	});

	const tela = {tab: 'Estatísticas do Modelo', name: 'Distribuição de Dados'};
	await tfvis.show.modelSummary(tela, model);
	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
