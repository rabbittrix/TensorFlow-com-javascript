$('#resultado').html('&nbsp;');
$('#classe').val('');
$('#arquivos').html('');

let X = [];
let Y = [];
const EPOCHS = 100;
const IMAGE_WIDTH = 28;
const IMAGE_HEIGHT = 28;
const IMAGE_CHANNELS = 3;
let model = getModel();

function getModel() {
	const model = tf.sequential();

	model.add(tf.layers.conv2d({
		inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
		kernelSize: 5,
		filters: 8,
		strides: 1,
		activation: 'sigmoid'
	}));
	model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

	model.add(tf.layers.conv2d({
		kernelSize: 5,
		filters: 16,
		strides: 1,
		activation: 'sigmoid'
	}));
	model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

	model.add(tf.layers.flatten());

	const NUM_OUTPUT_CLASSES = 1;
	model.add(tf.layers.dense({
		units: NUM_OUTPUT_CLASSES,
		activation: 'sigmoid'
	}));

	const optimizer = tf.train.adam();
	model.compile({
		optimizer: optimizer,
		loss: 'meanSquaredError'
	});

	return model;
}

function abrir() {
	let exibicao = document.querySelector('#exibicao');
	let captura = document.querySelector('#captura');
	let file = document.querySelector('input[type=file]').files[0];
	let reader = new FileReader();

	if(file) {
		reader.readAsDataURL(file);
		let arquivos = $('#arquivos').html().toString().trim();
		if(arquivos.indexOf('%') < 0) {
			if(arquivos.length > 0)
				$('#arquivos').html(arquivos+', '+file.name);
			else
				$('#arquivos').html(file.name);
		}

		if(file.name.toString().trim().indexOf('coca-cola') >= 0) $('#classe').val('Coca-Cola');
		else if(file.name.toString().trim().indexOf('sprite') >= 0) $('#classe').val('Sprite');
	}else {
		exibicao.src = './img/TensorFlow.png';
		captura.src = './img/TensorFlow.png';
	}

	reader.onloadend = function() {
		exibicao.src = reader.result;
		captura.src = reader.result;
	}
	$('#resultado').text('...');
}

function classificar() {
	$('#resultado').text('... classificando.');
	let className = $('#classe').val().trim();
	if(className.length <= 0) className = 'Classe INDEFINIDA';

	const img = document.getElementById('captura');
	const arrPixels = tf.browser.fromPixels(img, IMAGE_CHANNELS).arraySync();

	let numberClass = 0;
	if(className.indexOf('Sprite') >= 0) numberClass = 1;

	X.push(arrPixels);
	Y.push([numberClass]);

	const resultado =
	`CLASSIFICADO como <b><span class='text-danger'>${className.toUpperCase()}</span></b>`;
	$('#resultado').html(resultado);	
}

async function treinar() {
	$('#resultado').text('... processando treinamento.');
	$('#classe').val('...');
	$('#arquivos').text('...');

	let train = null;
	for(let i=1; i<=EPOCHS; i++) {
		let percent = parseFloat((i/100)*100).toFixed(0);
		$('#resultado').text(`${percent}%`);
		train = await model.fit(tf.tensor(X), tf.tensor(Y));
	}
	let erro = parseFloat(train.history.loss[0]).toFixed(4);
	let aprendizagem = parseFloat(100-erro).toFixed(4);

	$('#resultado').text('treinamento concluído.');
	$('#classe').val('');
	$('#arquivos').text(`taxa de aprendizagem: ${aprendizagem}%\r\ntaxa de erro: ${erro}%`);
}

async function prever() {
	$('#resultado').text('... processando predição.');
	$('#classe').val('...');

	const img = document.getElementById('captura');
	const Input = tf.browser.fromPixels(img, IMAGE_CHANNELS).arraySync();

	let output = await Number(model.predict(tf.tensor([Input])).round().arraySync());

	let classificacao = 'Coca-Cola';
	if(output > 0) classificacao = 'Sprite';

	$('#resultado').html(`<b><span class='text-danger'>${classificacao.toUpperCase()}</span><b>`);
	$('#classe').val(classificacao);
}
