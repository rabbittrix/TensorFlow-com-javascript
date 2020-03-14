const nettf = require('./RNATensorFlow');
const path = require('path');
const getColors = require('get-image-colors');

const config = {
	epochs: 400,
	activation: 'sigmoid',
	bias: 0,
	hiddenLayers: 1,
	model: 'img-class',
	dense: false,
	nOutputs: 1,
	formatIO: false
};

const net = new nettf(config);

let classesNomes = ['coca-cola', 'sprite'];

async function treinar(className='', limite=1) {
	let x = [];
	let y = [];
	const dir = `./treino/${className}`;
	for(let i=1; i<=limite; i++) {
		let index = i.toString();
		if(index.length <= 1) index = '0'.concat(index);

		let arrayColors = [];
		await getColors(path.join(dir, `${className}${index}.jpg`)).then(colors => {
			for(let c=0; c<colors.length; c++) {
				const rgb = colors[c].css().toString().
							replace('rgb', '').replace('(', '').replace(')', '');
				const arrayRgb = rgb.split(',');
				arrayColors.push(Number(arrayRgb[0]));
				arrayColors.push(Number(arrayRgb[1]));
				arrayColors.push(Number(arrayRgb[2]));
			}

			x.push(arrayColors);
			y.push([classesNomes.indexOf(className)]);
		});
	}
	await net.fit(x, y);
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

		let output = net.predict(arrayColors);
		output = output[0];
		const classificacao = classesNomes[Number(parseFloat(output).toFixed(0))].toString().trim();
		console.log(`CLASSIFICAÇAO: ${classificacao.toUpperCase()}`);

		let percentPositivo = 0;
		if(output > 0) percentPositivo = (1-output)*100; else percentPositivo = (100-output)*100;
		let percentNegativo = 100-percentPositivo;
		percentPositivo = parseFloat(percentPositivo).toFixed(4);
		percentNegativo = parseFloat(percentNegativo).toFixed(4);

		let maior = Math.max(percentNegativo, percentPositivo);
		let menor = Math.min(percentNegativo, percentPositivo);

		const probabilidades = 
		`${maior}% de probabilidades de pertencer a classe ${classificacao}.\r\n` +
		`${menor}% de probabilidades de pertencer a outras classes.`;
		console.log(probabilidades);
	});
}

//treinar('coca-cola', 8);
//treinar('sprite', 8);
//prever('coca-cola09.jpg');
//prever('coca-cola10.jpg');
//prever('sprite09.jpg');
prever('sprite10.jpg');
