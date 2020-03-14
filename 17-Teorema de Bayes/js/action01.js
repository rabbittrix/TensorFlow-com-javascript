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

function executar() {
	let selEntrada = $('#sel_entrada').val();
	let probabilidade = '';

	let nomeClasses = retornaClasses();

	if(selEntrada.toString().trim().length > 0) {
		let Naive = NaiveBayes(selEntrada);

		for(let i=0; i<nomeClasses.length; i++) {
			let percentual = parseFloat(Naive[nomeClasses[i]] * 100).toFixed(2);
			probabilidade += '<strong>' + nomeClasses[i] + ': </strong>' + percentual + '% - ';
		}

		probabilidade = ': ' + probabilidade + '#';
		probabilidade = probabilidade.replace(' - #', '');
	}else {
		probabilidade = ': 0';
	}

	$('#resultado').html(probabilidade);
}

// elimina os elementos duplicados
function eliminaDuplicados(arr) {
	arr = [...new Set(arr)];
	return arr;
}

// retorna as classes existentes
function retornaClasses() {
	let arr = classes;
	arr = eliminaDuplicados(arr);
	return arr;
}

/*
	cria um json com as classes como chave
	e as entradas de cada classe como valor
*/
function organizar() {
	let labels = retornaClasses();
	let params = {};

	for(let i=0; i<entradas.length; i++) {
		// separa as palavras com '-'
		let carac = '';
		if(i<(entradas.length-1)) carac = '-';

		/*
			concatena as entradas de cada classe
			no valor da classe correspondente

			a quantidade de palavras repetidas por classe
			corresponde ao número de classes para a respectiva palavra
		*/
		if(params[classes[i]]) {
			params[classes[i]] += entradas[i] + carac;
		}else {
			params[classes[i]] = entradas[i] + carac;
		}
	}

	// elimina a última vírgula de cada valor
	let str = JSON.stringify(params);
	str = str.replace(/-"/g, '"');
	str = str.replace(/-/g, ',');
	params = JSON.parse(str);

	return params;
}

// conta a quantidade de palavras repetidas em um texto
function contaTexto(texto, procura) {
	return texto.split(procura).length - 1;
}

// monta um json com o número de classes para cada entrada
function frequencia() {
	let categorias = [];
	let params = {};
	let objeto = organizar();
	let labels = retornaClasses();

	for(let i=0; i<entradas.length; i++) {
		params['Entrada'] = entradas[i];

		for(let j=0; j<labels.length; j++) {
			// conta o número de entradas em cada classe
			params[labels[j]] = contaTexto(objeto[labels[j]], entradas[i]);
		}

		categorias[i] = JSON.stringify(params);
	}

	categorias = eliminaDuplicados(categorias);

	for(let i=0; i<categorias.length; i++) {
		categorias[i] = JSON.parse(categorias[i]);
	}

	return categorias;
}

// retorna a quantidade de classes
function quantidadeClasses() {
	let categorias = frequencia();
	// menos 1 para desconsiderar o valor da Entrada
	return parseInt(Object.keys(categorias[0]).length-1);
}

// soma os valores das classes da entrada passada
function somaClasses(arr) {
	let soma = 0;
	// inicia em 1 para desconsiderar o valor da Entrada
	for(let i=1; i<arr.length; i++) {
		soma += parseInt(arr[i]);
	}
	return soma;
}

// retorna a soma total de cada classe
function totalPorClasse() {
	let totalClasse = [];
	let nomeClasses = retornaClasses();
	let str_classes = JSON.stringify(classes);

	for(let i=0; i<nomeClasses.length; i++) {
		totalClasse[nomeClasses[i]] = contaTexto(str_classes, nomeClasses[i]);
	}
	return totalClasse;
}

// soma dos totais de todas as classes
function somaTotaisClasses() {
	return classes.length;
}

// pesos para as entradas
function entradasPeso() {
	let pesos = [];
	let categorias = frequencia();

	for(let i=0; i<categorias.length; i++) {
		// Object.values(categorias[i]): retorna um vetor com os valores de cada chave
		pesos[categorias[i].Entrada] = somaClasses(Object.values(categorias[i])) / somaTotaisClasses();
	}
	return pesos;
}

// pesos para as classes
function classesPeso() {
	let nomeClasses = retornaClasses();
	let totalClasses = totalPorClasse();

	let pesos = [];

	for(let i=0; i<nomeClasses.length; i++) {
		pesos[nomeClasses[i]] = totalClasses[nomeClasses[i]] / somaTotaisClasses();
	}
	return pesos;
}

// retorna a ocorrência de uma 'Classe' para uma 'Entrada'
function ocorrenciaClasseParaEntrada(_entrada='', _classe='') {
	let categorias = frequencia();
	let retorno = 0;

	categorias.forEach((item) => {
		if(item['Entrada'] == _entrada) {
			retorno = parseInt(item[_classe]);
		}
	});
	return retorno;
}

// calcula a probabilidade da entrada pertencer a uma determinada classe
function NaiveBayes(_entrada='') {
	let nomeClasses = retornaClasses();
	let totalClasse = totalPorClasse();

	// soma os resultados de todas as classes da 'Entrada' passada
	let categorias = frequencia();
	let soma = 0;
	categorias.forEach((item) => {
		if(item['Entrada'] == _entrada) {
			for(let i=0; i<nomeClasses.length; i++) {
				soma += parseInt(item[nomeClasses[i]]);
			}
		}
	});
	soma = tf.scalar(soma);

	let sumClass = tf.scalar(somaTotaisClasses());
	let probabilidade = [];
	for(let i=0; i<nomeClasses.length; i++) {
		let ocorrencia = tf.scalar(ocorrenciaClasseParaEntrada(_entrada, nomeClasses[i]));
		let totalC = tf.scalar(totalClasse[nomeClasses[i]]);

		probabilidade[nomeClasses[i]] = 
		ocorrencia.div(totalC).mul(totalC.div(sumClass)).div(soma.div(sumClass)).dataSync();
	}

	return probabilidade;
}
