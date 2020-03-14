let primeiraVEZ = true;

async function exibir() {
	const headers = [
		'Nome',
		'Idade',
		'Sexo'
	];

	const values = [
		['Fulano de Tal', 25, 'M'],
		['Ciclano da Silva', 42, 'M'],
		['Fulana de Tal', 22, 'F'],
		['Beotrano de Tal', 31, 'M']
	];

	const tela = {tab: 'Plotagem de Dados', name: 'Tabela'};
	tfvis.render.table(tela, {headers, values});
	
	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
