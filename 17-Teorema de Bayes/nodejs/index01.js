const tf = require('@tensorflow/tfjs');
const fs = require('fs');

let entradas = [];
let classes = [];
let carregados = '';

function addFile(path) {
	let data = fs.readFileSync(path, {encoding: 'utf8'});
	data = data.toString().trim();

	let Classe = path.substr(0, path.indexOf('.')).toString().trim();

	data = data.replace(/\r\n\r\n/g, '');
	let lines = data.split('\r\n');

	for(let i=0; i<lines.length; i++) {
		// tokenização de texto
		let tokens = lines[i].split(' ');

		for(let j=0; j<tokens.length; j++) {
			entradas.push(tokens[j].toString().trim());
			classes.push(Classe);
		}
	}
}

function execBayes(path='', teste=false) {
	let data = fs.readFileSync(path, {encoding: 'utf8'});
	data = data.toString().trim();

	let Entrada = data;
	let tokenizationEntrada = Entrada.split(' ');

	let nomeClasses = retornaClasses();
	let probabilidade = [];

	for(let x=0; x<tokenizationEntrada.length; x++) {
		let Naive = NaiveBayes(tokenizationEntrada[x]);

		for(let i=0; i<nomeClasses.length; i++) {
			let percentual = parseFloat(Naive[nomeClasses[i]] * 100).toFixed(2);
			if(percentual>=50) probabilidade.push(nomeClasses[i]);
		}
	}

	let classificacao = '';
	let repeticao = 0;
	for(let i=0; i<nomeClasses.length; i++) {
		let repete = probabilidade.filter(function(x){return x==nomeClasses[i]}).length;
		if(repete > repeticao) {
			repeticao = repete;
			classificacao = nomeClasses[i];
		}
	}

	if(teste) return classificacao;
	else console.log({Class: classificacao});
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

function test() {
	let testClass = ['Elon Musk', 'Jeff Bezos'];
	let acertos = erros = 0;
	for(let i=0; i<testClass.length; i++) {
		for(let j=0; j<10; j++) {
			let retorno = execBayes(`./Testes/${testClass[i]}/teste${j}.txt`, true);
			if(retorno==testClass[i]) acertos++;
			else erros++;
		}
	}
	let confiabilidade = (acertos/(acertos+erros))*100;
	console.log(`confiabilidade: ${confiabilidade}%`);
}

addFile('Elon Musk.txt');
addFile('Jeff Bezos.txt');
//test();
execBayes('Teste - Elon Musk.txt');
