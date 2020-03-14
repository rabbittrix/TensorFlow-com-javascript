let entradas = [];
let classes = [];
let carregados = '';

let classesIndex = 0;
let objClasses = [];

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
			let Classe = str.substr(0, str.indexOf('.')).toString().trim();
			objClasses.push({classe: Classe, indice: classesIndex});

			data = data.replace(/\r\n\r\n/g, '');
			let lines = data.split('\r\n');

			for(let i=0; i<lines.length; i++) {
				// tokenização de texto
				let tokens = lines[i].split(' ');

				entradas.push(arrayStringToNumber(tokens));
				classes.push([classesIndex]);
			}

			carregados += 'Carregado o arquivo: ' + Classe + '<br>';
			$('#carregados').html(carregados);
			prepararCadastro();
			classesIndex++;
		}
	});
}

function prepararCadastro() {
	$('#entrada').val('');
	$('#classe').val('0');
}

// elimina os elementos duplicados
function eliminaDuplicados(arr) {
	arr = [...new Set(arr)];
	return arr;
}

// converte o texto para o número correspondente
function arrayStringToNumber(arr) {
	let result = [];
	let qtd = 0;
	let sum = 0;
	for(let i=0; i<arr.length; i++) {
		let element = arr[i];
		if(element.length>0) {
			element = [...element].map(char => char.charCodeAt(0))
								  .reduce((current, previous) => previous + current);
			sum += Math.sqrt(element);
			qtd++;
		}else {
			sum += 0;
		}
	}
	let mean = parseFloat(sum / qtd).toFixed(0);
	result.push(Number(mean));
	return result;
}

// converte o número para a classe correspondente
function toClass(arr) {
	let result = '';
	let output = arr[0];
	for(let i=0; i<objClasses.length; i++) {
		if(objClasses[i].indice == output) result = objClasses[i].classe;
	}
	return result;
}

function executar() {
	let Entrada = $('#entrada').val().toString().trim();
	let tokenizationEntrada = Entrada.split(' ');

	if(tokenizationEntrada.length > 0) {
		$('#classe').html(' ...carregando.');
		let execucao = arrayStringToNumber(tokenizationEntrada);

		const model = tf.sequential();
		const inputLayer = tf.layers.dense({units: 1, inputShape: [1]});
		model.add(inputLayer);
		model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.001)});

		const x = tf.tensor(entradas, [entradas.length, 1]);
		const y = tf.tensor(classes, [classes.length, 1]);

		const input = tf.tensor(execucao, [execucao.length, 1]);

		model.fit(x, y, {epochs: 500}).then(() => {
			let output = model.predict(input).abs().round().dataSync();
			output = toClass(output);
			$('#classe').html(output);
		});
	}
}
