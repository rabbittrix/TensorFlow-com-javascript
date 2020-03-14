$('#resultado').html('&nbsp;');
$('#arquivos').html('');

let X = [];
let Y = [];
const EPOCHS = 100;
const IMAGE_WIDTH = 28;
const IMAGE_HEIGHT = 28;
const IMAGE_CHANNELS = 1;
let model = getModel();

function getModel() {
	const model = tf.sequential();

	model.add(tf.layers.conv2d({
		inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
		kernelSize: 5,
		filters: 8,
		strides: 1,
		activation: 'linear'
	}));
	model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

	model.add(tf.layers.conv2d({
		kernelSize: 5,
		filters: 16,
		strides: 1,
		activation: 'linear'
	}));
	model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

	model.add(tf.layers.flatten());

	const NUM_OUTPUT_CLASSES = 1;
	model.add(tf.layers.dense({
		units: NUM_OUTPUT_CLASSES,
		activation: 'linear'
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
	for(let c=0; c<=9; c++) {
		for(let i=0; i<=59; i++) {
			let index = i.toString().trim();
			if(index.length==1) index = '00'.concat(index);
			else if(index.length==2) index = '0'.concat(index);
			let img = document.getElementById(`${c}_${index}`);
			let numberClass = Number(c);

			const arrPixels = tf.browser.fromPixels(img, IMAGE_CHANNELS).arraySync();

			X.push(arrPixels);
			Y.push([numberClass]);
		}
		let percent = parseFloat(((c+1)/10)*100).toFixed(0);
		$('#resultado').text(`${percent}%`);
	}
	$('#arquivos').html(`classificação de treinamento realizada com sucesso.`);
}

async function treinar() {
	$('#resultado').text('... processando treinamento.');
	$('#arquivos').text('...');
	classificar();

	let train = null;
	for(let i=1; i<=EPOCHS; i++) {
		let percent = parseFloat((i/EPOCHS)*100).toFixed(0);
		$('#resultado').text(`${percent}%`);
		train = await model.fit(tf.tensor(X), tf.tensor(Y));
	}
	let erro = parseFloat(train.history.loss[0]).toFixed(4);
	let aprendizagem = parseFloat(100-erro).toFixed(4);

	$('#resultado').text('treinamento concluído.');
	$('#arquivos').text(`taxa de aprendizagem: ${aprendizagem}%\r\ntaxa de erro: ${erro}%`);
}

async function prever() {
	$('#resultado').text('... processando predição.');

	const img = document.getElementById('captura');
	const Input = tf.browser.fromPixels(img, IMAGE_CHANNELS).arraySync();

	let output = await Number(model.predict(tf.tensor([Input])).round().arraySync());
	console.log(output);

	let classificacao = output;
	if(classificacao<=0) classificacao =   'ZERO';
	if(classificacao==1) classificacao =     'UM';
	if(classificacao==2) classificacao =   'DOIS';
	if(classificacao==3) classificacao =   'TRES';
	if(classificacao==4) classificacao = 'QUATRO';
	if(classificacao==5) classificacao =  'CINCO';
	if(classificacao==6) classificacao =   'SEIS';
	if(classificacao==7) classificacao =   'SETE';
	if(classificacao==8) classificacao =   'OITO';
	if(classificacao>=9) classificacao =   'NOVE';

	$('#resultado').html(`DIGITO: <b><span class='text-danger'>${classificacao}</span><b>`);
}

function carregar() {
	let images = '';
	for(c=0; c<=9; c++) {
		for(let i=0; i<=59; i++) {
			let index = i.toString().trim();
			if(index.length==1) index = '00'.concat(index);
			else if(index.length==2) index = '0'.concat(index);
			let src = `./mnist/treino/${c}_${index}.jpg`;
			images +=
			`<img id='${c}_${index}' src='${src}' width='28px' height='28px' style='visibility: hidden;'>`;
		}
	}
	$('#treino').html(images);
}

carregar();
