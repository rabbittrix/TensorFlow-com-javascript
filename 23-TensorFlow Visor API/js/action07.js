let primeiraVEZ = true;

async function exibir() {
	const dados = [
		{index: 0, value: 0  },
		{index: 1, value: 50 },
		{index: 2, value: 100},
		{index: 3, value: 150},
		{index: 4, value: NaN},
		{index: 5, value: Infinity}
	];

	const tela = {tab: 'Plotagem de Dados', name: 'Histograma'};
	tfvis.render.histogram(tela, dados);

	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
