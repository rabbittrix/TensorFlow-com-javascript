let primeiraVEZ = true;

async function exibir() {
	const series = [
		{x: 0, y: 0  },
		{x: 1, y: 100},
		{x: 2, y: 150},
		{x: 3, y: 50 },
		{x: 4, y: 100}
	];

	const dados = {values: [series]};

	const tela = {tab: 'Plotagem de Dados', name: 'Gráfico de Linhas'};
	tfvis.render.linechart(tela, dados);

	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
