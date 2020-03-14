$('#result').text('');

let arrX = [];
let arrY = [];

function exibir(str='') {
	$('#result').text(str);
}

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
		success: function(data) {
			let caractere = ',';
			if(data.indexOf(';') >= 0) caractere = ';';
			let arrLinha = data.split('\r\n');

			let titulos = arrLinha[0].split(caractere);
			let qtdEntradas = titulos.filter(function(x) { return x == 'input'; }).length;

			let X = [];
			let Y = [];
			for(let i=1; i<arrLinha.length; i++) {
				let arrCelula = arrLinha[i].split(caractere);
				let sumX = 0;
				for(let j=0; j<arrCelula.length; j++) {
					if(arrCelula[j].toString().trim().length > 0) {
						if(j<qtdEntradas)
							sumX += parseFloat(arrCelula[j]);
						else
							Y.push([parseFloat(arrCelula[j])]);
					}
				}

				if(sumX>0) X.push(parseFloat(sumX/qtdEntradas));
			}

			arrX = X;
			arrY = Y;

			exibir('dados carregados com sucesso.');
			$('#metros').val('');
			$('#idade').val('');
			$('#preco').val('');
		}
	});
}

function executar() {
	exibir('...processando.');
	let input = (parseFloat($('#metros').val()) + parseFloat($('#idade').val())) / 2;
	NeuralNetwork(input);
}

function NeuralNetwork(Input) {
	exibir('...processando.');

	let units = 1;
	let inputShape = 1;
	let linesX = Number(arrX.length);
	let linesInput = 1;

	const model = tf.sequential();
	const inputLayer = tf.layers.dense({units: units, inputShape: [inputShape]});
	model.add(inputLayer);
	model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.00001)});

	const x = tf.tensor(arrX, [linesX, inputShape]);
	const y = tf.tensor(arrY);
	const input = tf.tensor(Input, [linesInput, inputShape]);

	model.fit(x, y, {epochs: 240}).then(() => {
		let output = model.predict(input).dataSync();
		output = converteArray(output);
		output = aproximaOutput(output);
		$('#preco').val(output);
		exibir('concluído.');
	});
}

function converteArray(array) {
	let result = [];
	for(let i=0; i<array.length; i++) {
		result.push(Math.ceil(array[i].toFixed(0)));
	}
	return result;
}

function aproximaOutput(number) {
	let two = number.toString().substr(0, 2);
	return Number(two.padEnd(number.toString().length, 0));
}
