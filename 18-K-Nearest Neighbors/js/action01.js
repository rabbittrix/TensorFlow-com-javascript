let eixoX =  [];
let eixoY =  [];
let classe = [];

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
			eixoX =  [];
			eixoY =  [];
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

function knn() {
	let tensorX = tf.tensor(eixoX);
	let tensorY = tf.tensor(eixoY);
	let tfEntradaX = tf.scalar(entradaX);
	let tfEntradaY = tf.scalar(entradaY);

	let tfRaiz = tensorX.sub(tfEntradaX).square()
						.add(tensorY.sub(tfEntradaY).square()).sqrt();

	let menorRaiz = tfRaiz.min().dataSync();
	let arrayRaiz = tfRaiz.dataSync();

	let entradaClasse = classe[arrayRaiz.indexOf(menorRaiz[0])];

	return entradaClasse;
}

function retornaClasse() {
	entradaX = parseFloat($('#entradaX').val());
	entradaY = parseFloat($('#entradaY').val());
	$('#entradaC').val(knn());
}
