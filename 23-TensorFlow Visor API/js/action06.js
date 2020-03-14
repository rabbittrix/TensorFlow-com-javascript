let primeiraVEZ = true;

async function exibir() {
	const dados = [
		{index: 0, value: 50 },
		{index: 1, value: 100},
		{index: 2, value: 150}
	];

	const tela = {tab: 'Plotagem de Dados', name: 'Gráfico de Barras'};
	tfvis.render.barchart(tela, dados);

	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
