let eixoX = [];
let eixoY = [];

let entradaX = 0;
let entradaY = 0;

$('#entradaX').val('');
$('#entradaY').val('');
$('#entradaZ').val('');

let model = null;

function abrir(event) {
	let file = event.target.value;
	file = file.replace(/\\/g, '-');
	let arr = file.split('-');
	carregar(arr[arr.length-1]);
}

function carregar(str) {
	$.ajax({
		url: str,
		dataType: 'text',
		success: async function(data) {
			eixoX = [];
			eixoY = [];

			let carac = ',';
			if(data.indexOf(';') >= 0) carac = ';';
			let lines = data.split('\r\n');
			for(let i=1; i<lines.length; i++) {
				let celulas = lines[i].split(carac);
				eixoX.push([Number(celulas[0]), Number(celulas[1])]);
				eixoY.push([Number(celulas[2])]);
			}

			await treinamento();
		}
	});
}

async function treinamento() {
	const x = tf.tensor(eixoX);
	const y = tf.tensor(eixoY);

	let taxa = 1;
	while(taxa>0.1) {
		model = tf.sequential();
		let inputLayer = tf.layers.dense({units: 2, inputShape: [2], activation: 'tanh'});
		let hiddenLayer = tf.layers.dense({units: 1, inputShape: [2], activation: 'sigmoid'});
		model.add(inputLayer);
		model.add(hiddenLayer);
		model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.rmsprop(.05)});

		for(let i=1; i<=1000; i++) {
			let train = await model.fit(x, y);
			taxa = parseFloat(train.history.loss[0]).toFixed(4);
			if(i%10==0) $('#erro').text(taxa);
			if(taxa==0) i=1001;
		}
	}

	$('#erro').text('0.0000');
}

function predicao() {
	const z = tf.tensor([[entradaX, entradaY]]);
	let output = model.predict(z).round().arraySync();
	return output;
}

function limpar() {
	$('#entradaZ').val('');
}

function executar() {
	entradaX = Number($('#entradaX').val());
	entradaY = Number($('#entradaY').val());
	$('#entradaZ').val(predicao());
}
