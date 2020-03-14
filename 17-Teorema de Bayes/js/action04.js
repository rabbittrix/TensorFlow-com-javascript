let entradas = [];
let classes = [];

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
			let carac = ',';
			if(data.indexOf(';') >= 0) carac = ';';
			let lines = data.split('\r\n');
			for(let i=1; i<lines.length; i++) {
				let celulas = lines[i].split(carac);
				entradas.push(celulas[0]);
				classes.push(celulas[1]);
			}	
			cadastrar();
		}
	});
}

function salvar() {
	let txt = 'input;output\r\n';
	for(let i=0; i<entradas.length; i++) {
		txt += entradas[i]+';'+classes[i]+'\r\n';
	}
	txt += '#';
	txt = txt.replace(/\r\n#/g, '');
	let filename = 'modelo';
	let blob = new Blob([txt], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, filename + '.csv');
}

function prepararCadastro() {
	$('#entrada').val('');
	$('#classe').val('');
}

function cadastrar() {
	if($('#entrada').val().toString().trim().length > 0) {
		entradas.push($('#entrada').val().toString().trim());
		classes.push($('#classe').val().toString().trim());
	}

	let linhas = '';
	for(let i=0; i<entradas.length; i++) {
		linhas +=
		"<tr>" +
			"<td>" + entradas[i] + "</td>" +
			"<td>" + classes[i] + "</td>" +
		"</tr>";
	}

	let opcoes = "<option value=''></option>";
	let nomeEntradas = eliminaDuplicados(entradas);
	for(let i=0; i<nomeEntradas.length; i++) {
		opcoes += "<option value='" + nomeEntradas[i] + "'>" + nomeEntradas[i] + "</option>";
	}

	$('#linhas').html(linhas);
	$('#sel_entrada').html(opcoes);
}

// elimina os elementos duplicados
function eliminaDuplicados(arr) {
	arr = [...new Set(arr)];
	return arr;
}

// converte o texto para o número correspondente
function arrayStringToNumber(arr) {
	let result = [];
	for(let i=0; i<arr.length; i++) {
		let element = arr[i];
		if((element == 'bom')||(element == 'positivo')) element = 1;
		else element = 0;
		result.push(element);
	}
	return result;
}

// converte o número para a classe correspondente
function toClass(arr) {
	let output = arr[0];
	if(output <= 0) output = 'negativo';
	else output = 'positivo';
	return output;
}

function executar() {
	let execucao = [];
	let sel_entrada = $('#sel_entrada').val().toString().trim();
	if(sel_entrada.length > 0) {
		$('#resultado').html(' ...carregando.');
		execucao = arrayStringToNumber([sel_entrada]);

		const model = tf.sequential();
		const inputLayer = tf.layers.dense({units: 1, inputShape: [1]});
		model.add(inputLayer);
		model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

		const x = tf.tensor(arrayStringToNumber(entradas), [entradas.length, 1]);
		const y = tf.tensor(arrayStringToNumber(classes), [classes.length, 1]);
		const input = tf.tensor(execucao, [1, 1]);

		model.fit(x, y, {epochs: 500}).then(() => {
			let output = model.predict(input).abs().round().dataSync();
			output = toClass(output);
			$('#resultado').html(` - CLASSIFICAÇAO: <strong>${output}</strong>`)
		});
	}
}
