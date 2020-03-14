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
							Y.push(parseFloat(arrCelula[j]));
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
	let output = regressaoLinear(input);
	$('#preco').val(output);
	exibir('concluído.');
}

function regressaoLinear(input) {
	let x = tf.tensor(arrX);
	let y = tf.tensor(arrY);

	let resultado1 = x.sum().mul(y.sum()).div(x.size);
	let resultado2 = x.sum().mul(x.sum()).div(x.size);
	let resultado3 = x.mul(y).sum().sub(resultado1);
	let resultado4 = resultado3.div(x.square().sum().sub(resultado2));
	let resultado5 = y.mean().sub(resultado4.mul(x.mean()));

	let tensor = resultado4.mul(input).add(resultado5);
	let result = tensor.dataSync();
	return result;
}
