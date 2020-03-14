let eixoX =  [];
let eixoY =  [];
let classe = [];
let classesNomes = [];

let entradaX = 0;
let entradaY = 0;

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
			eixoX = [];
			eixoY = [];
			classe = [];
			let carac = ',';
			if(data.indexOf(';') >= 0) carac = ';';
			let lines = data.split('\r\n');
			for(let i=1; i<lines.length; i++) {
				let celulas = lines[i].split(carac);
				eixoX.push(Number(celulas[0]));
				eixoY.push(Number(celulas[1]));
				classe.push(celulas[2].toString().trim());
			}
			cadastrar();
			classesNomes = [... new Set(classe)];
		}
	});
}

function salvar() {
	let txt = 'input;input;output\r\n';
	for(let i=0; i<eixoX.length; i++) {
		txt += eixoX[i]+';'+eixoY[i]+';'+classe[i]+'\r\n';
	}
	txt += '#';
	txt = txt.replace(/\r\n#/g, '');
	let filename = 'modelo';
	let blob = new Blob([txt], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, filename + '.csv');
}

function prepararCadastro() {
	$('#eixoX').val('');
	$('#eixoY').val('');
	$('#classe').val('');
}

function cadastrar() {
	if($('#eixoX').val().toString().trim().length > 0) {
		eixoX.push(Number($('#eixoX').val()));
		eixoY.push(Number($('#eixoY').val()));
		classe.push($('#classe').val().toString().trim());
	}

	let linhas = '';
	for(let i=0; i<eixoX.length; i++) {
		linhas +=
		"<tr>" +
			"<td>" + eixoX[i] + "</td>" +
			"<td>" + eixoY[i] + "</td>" +
			"<td>" + classe[i] + "</td>" +
		"</tr>";
	}

	$('#linhas').html(linhas);
}

function toNumberClass(strClass='') {
	let index = 0;
	for(let i=0; i<classesNomes.length; i++) {
		if(classesNomes[i].trim()==strClass.trim()) {
			index = i;
		}
	}
	return Number(index);
}

function toStringClass(numberClass=0) {
	numberClass = Number(parseFloat(numberClass[0]).toFixed(0));
	if(numberClass>(classesNomes.length-1)) numberClass = Number(classesNomes.length-1);

	let name = '';
	for(let i=0; i<classesNomes.length; i++) {
		if(i==numberClass) {
			name = classesNomes[i].trim();
		}
	}
	return name;
}

function toArrayNumberClass(arrClass) {
	let result = [];
	for(let i=0; i<arrClass.length; i++) {
		result.push(toNumberClass(arrClass[i]));
	}
	return result;
}

function classificadorRNA() {
	$('#entradaC').val(' ...carregando.');
	let entradas = [];
	for(let i=0; i<eixoX.length; i++) {
		entradas.push([eixoX[i], eixoY[i]]);
	}
	let outputs = toArrayNumberClass(classe);
	let execucao = [[entradaX, entradaY]];

	const model = tf.sequential();
	const inputLayer = tf.layers.dense({units: 1, inputShape: [2]});
	model.add(inputLayer);
	model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.0001)});

	const x = tf.tensor(entradas, [entradas.length, 2]);
	const y = tf.tensor(outputs, [outputs.length, 1]);

	const input = tf.tensor(execucao, [execucao.length, 2]);

	model.fit(x, y, {epochs: 400}).then(() => {
		let output = model.predict(input).abs().round().arraySync();
		if(isNaN(output)) {
			model.fit(x, y, {epochs: 400}).then(() => {
				output = model.predict(input).abs().round().arraySync();
				output = toStringClass(output);
				$('#entradaC').val(output);
			});
		}else {
			output = toStringClass(output);
			$('#entradaC').val(output);
		}
	});
}

function retornaClasse() {
	entradaX = parseFloat($('#entradaX').val());
	entradaY = parseFloat($('#entradaY').val());
	classificadorRNA();
}
