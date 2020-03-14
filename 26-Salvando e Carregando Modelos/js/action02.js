$('#n1').val('');
$('#n2').val('');
$('#n3').val('');

let model = tf.sequential();

async function treinar() {
	model.add(tf.layers.dense({inputShape: [2], units: 1, activation: 'sigmoid'}));
	model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.sgd(.05)});

	const x = tf.tensor([[0, 0], [0, 1], [1, 0], [1, 1]]);
	const y = tf.tensor([[0], [1], [1], [1]]);

	let epochs = 1000;
	for(let i=1; i<=epochs; i++) {
		let carregamento = parseFloat((i/epochs)*100).toFixed(0);
		$('#loading').text(`${carregamento}%`);
		await model.fit(x, y);
	}
	$('#loading').text('concluído.');
}

function limparResposta() { $('#n3').val(''); }

async function salvar() {
	const salvo = await model.save('localstorage://model-or');
	if(salvo) $('#loading').text('modelo salvo com sucesso.');
}

async function carregar() {
	model = await tf.loadLayersModel('localstorage://model-or');
	if(model) $('#loading').text('modelo carregado com sucesso.');
}

async function executar() {
	let n1 = Number($('#n1').val());
	let n2 = Number($('#n2').val());

	let n3 = Number(model.predict(tf.tensor([[n1, n2]])).round().arraySync());

	$('#n3').val(n3);
}
