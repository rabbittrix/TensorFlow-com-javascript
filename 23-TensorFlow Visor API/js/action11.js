let primeiraVEZ = true;

async function exibir() {
	const series1 = [
		{x: 0, y: 0  },
		{x: 1, y: 100},
		{x: 2, y: 150},
		{x: 3, y: 50 },
		{x: 4, y: 100}
	];

	const series2 = [
		{x: 0, y: 50 },
		{x: 1, y: 150},
		{x: 2, y: 100},
		{x: 3, y: 150},
		{x: 4, y: 50 }
	];

	const dados = {values: [series1, series2]};

	const tela = {tab: 'Plotagem de Dados', name: 'Gráfico de Dispersão'};
	tfvis.render.scatterplot(tela, dados);
	
	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
