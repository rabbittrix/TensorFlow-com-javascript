let primeiraVEZ = true;
let output = null;
let model = tf.sequential();

function carregarDados() {
	$.ajax({
		url: './nodejs/bitcoin01.csv',
		dataType: 'text',
		success: function(data) {
			let bitcoin01 = document.getElementById('bitcoin01');
			bitcoin01.innerText = data.toString().trim();
		}
	});

	$.ajax({
		url: './nodejs/bitcoin02.csv',
		dataType: 'text',
		success: function(data) {
			let bitcoin02 = document.getElementById('bitcoin02');
			bitcoin02.innerText = data.toString().trim();
		}
	});

	$.ajax({
		url: './nodejs/bitcoin03.csv',
		dataType: 'text',
		success: function(data) {
			let bitcoin03 = document.getElementById('bitcoin03');
			bitcoin03.innerText = data.toString().trim();
		}
	});
}

async function treinar() {
	$('.btn').prop('disabled', true);
	let X = [];
	let Y = [];

	let arquivo1 = $('#bitcoin01').html().trim();
	arquivo1 = arquivo1.toString().trim();

	const linhas1 = arquivo1.split('<br>');

	for(let l=linhas1.length-1; l>=1; l--) {
		let celulas = linhas1[l].toString().split(';');

		const Fechamento = Number(celulas[1]);
		const Abertura   = Number(celulas[2]);
		const Maxima     = Number(celulas[3]);
		const Minima     = Number(celulas[4]);

		X.push([[Fechamento], [Abertura], [Maxima], [Minima]]);
	}

	let arquivo2 = $('#bitcoin02').html().trim();
	arquivo2 = arquivo2.toString().trim();

	const linhas2 = arquivo2.split('<br>');

	for(let l=linhas2.length-1; l>=1; l--) {
		let celulas = linhas2[l].toString().split(';');

		const Fechamento = Number(celulas[1]);
		const Abertura   = Number(celulas[2]);
		const Maxima     = Number(celulas[3]);
		const Minima     = Number(celulas[4]);

		Y.push([[Fechamento], [Abertura], [Maxima], [Minima]]);
	}

	const x = tf.tensor(X);
	const y = tf.tensor(Y);

	const rnn = tf.layers.simpleRNN({units: 1, returnSequences: true, activation: 'linear'});
	const inputLayer = tf.input({shape: [X[0].length, 1]});
	rnn.apply(inputLayer);

	model.add(rnn);

	model.compile({loss: 'meanSquaredError', optimizer: tf.train.adam(.005)});
	for(let i=1; i<=1000; i++) {
		let percent = parseFloat((i/1000)*100).toFixed(0);
		$('#loading').text(`${percent}%`);
		await model.fit(x, y);
	}

	await predizer();
}

async function predizer() {
	let X = [];

	let arquivo = $('#bitcoin03').html().trim();
	arquivo = arquivo.toString().trim();

	const linhas = arquivo.split('<br>');

	for(let l=linhas.length-1; l>=1; l--) {
		let celulas = linhas[l].toString().split(';');

		const Fechamento = Number(celulas[1]);
		const Abertura   = Number(celulas[2]);
		const Maxima     = Number(celulas[3]);
		const Minima     = Number(celulas[4]);

		X.push([[Fechamento], [Abertura], [Maxima], [Minima]]);
	}

	const input = tf.tensor(X);

	output = await model.predict(input).abs().arraySync();
	$('#loading').text('concluído.');
	$('.btn').prop('disabled', false);
}

async function exibir() {
	let Fechamento = [];
	let Abertura = [];
	let Maxima = [];
	let Minima = [];
	for(let i=0; i<output.length; i++) {
		Fechamento.push({x: i, y: Number(parseFloat(output[i][0]).toFixed(1))});
	}
	for(let i=0; i<output.length; i++) {
		Abertura.push({x: i, y: Number(parseFloat(output[i][1]).toFixed(1))});
	}
	for(let i=0; i<output.length; i++) {
		Maxima.push({x: i, y: Number(parseFloat(output[i][2]).toFixed(1))});
	}
	for(let i=0; i<output.length; i++) {
		Minima.push({x: i, y: Number(parseFloat(output[i][3]).toFixed(1))});
	}

	const dadosFechamento = {series: ['Fechamento'], values: [Fechamento]};
	const telaFechamento = {tab: 'Fechamento', name: 'Previsão do Bitcoin para daqui 30 dias'};

	const dadosAbertura = {series: ['Abertura'], values: [Abertura]};
	const telaAbertura = {tab: 'Abertura', name: 'Previsão do Bitcoin para daqui 30 dias'};

	const dadosMaxima = {series: ['Máxima'], values: [Maxima]};
	const telaMaxima = {tab: 'Máxima', name: 'Previsão do Bitcoin para daqui 30 dias'};

	const dadosMinima = {series: ['Mínima'], values: [Minima]};
	const telaMinima = {tab: 'Mínima', name: 'Previsão do Bitcoin para daqui 30 dias'};

	tfvis.render.linechart(telaFechamento, dadosFechamento);
	tfvis.render.linechart(telaAbertura, dadosAbertura);
	tfvis.render.linechart(telaMaxima, dadosMaxima);
	tfvis.render.linechart(telaMinima, dadosMinima);

	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}

carregarDados();
