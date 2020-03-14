const tf = require('@tensorflow/tfjs');
const path = require('path');
const getColors = require('get-image-colors');

let classificacoes = [];

function treinar(className='', limite=1) {
	const dir = `./treino/${className}`;
	for(let i=1; i<=limite; i++) {
		let index = i.toString();
		if(index.length <= 1) index = '0'.concat(index);

		let arrayColors = [];
		getColors(path.join(dir, `${className}${index}.jpg`)).then(colors => {
			for(let c=0; c<colors.length; c++) {
				const rgb = colors[c].css().toString().
							replace('rgb', '').replace('(', '').replace(')', '');
				const arrayRgb = rgb.split(',');
				arrayColors.push(Number(arrayRgb[0]));
				arrayColors.push(Number(arrayRgb[1]));
				arrayColors.push(Number(arrayRgb[2]));
			}

			const objClasse = {Class: className, Pixels: arrayColors};
			classificacoes.push(objClasse);
		});
	}
}

function prever(file='') {
	let arrayColors = [];
	getColors(path.join('./teste', `${file}`)).then(colors => {
		for(let c=0; c<colors.length; c++) {
			const rgb = colors[c].css().toString().
						replace('rgb', '').replace('(', '').replace(')', '');
			const arrayRgb = rgb.split(',');
			arrayColors.push(Number(arrayRgb[0]));
			arrayColors.push(Number(arrayRgb[1]));
			arrayColors.push(Number(arrayRgb[2]));
		}

		const tfPixels1 = tf.tensor(arrayColors);

		let arrDiferencas = [];
		let arrClassName = [];
		for(let i=0; i<classificacoes.length; i++) {
			const className = classificacoes[i].Class.trim();
			const tfPixels2 = tf.tensor(classificacoes[i].Pixels);

			const diferenca = tfPixels1.sub(tfPixels2).abs().sum().arraySync();
			arrClassName.push(className);
			arrDiferencas.push(diferenca);
		}

		const menor = tf.tensor(arrDiferencas).min().arraySync();
		const maior = tf.tensor(arrDiferencas).max().arraySync();
		const percentPositivo = parseFloat(100-((menor/(menor+maior))*100)).toFixed(8);
		const percentNegativo = parseFloat(100-percentPositivo).toFixed(8);
		let index = 0;
		for(let i=0; i<arrDiferencas.length; i++) {
			if(arrDiferencas[i]==menor) index = i;
		}

		const classificacao = arrClassName[index].toString().trim();
		console.log(`CLASSIFICAÇAO: ${classificacao.toUpperCase()}`);

		const probabilidades = 
		`${percentPositivo}% de probabilidades de pertencer a classe ${classificacao}.\r\n` +
		`${percentNegativo}% de probabilidades de pertencer a outras classes.`;
		console.log(probabilidades);
	});
}

treinar('coca-cola', 8);
treinar('sprite', 8);
//prever('coca-cola09.jpg');
//prever('coca-cola10.jpg');
//prever('sprite09.jpg');
prever('sprite10.jpg');
