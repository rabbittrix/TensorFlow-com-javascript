const tf = require('@tensorflow/tfjs');
const Jimp = require('jimp');
const fs = require('fs');

async function treino(className='', prefix=0) {
	const dir = `./treino/${className}`;
	let index = prefix.toString();
	if(index.length <= 1) index = '0'.concat(index);

	let dirFile = `${dir}/${className}${index}.jpg`;

	await Jimp.read(dirFile, (err, img1) => {
		if(err) console.error(err);
		let dirFileTemp = `./temp/${className}${index}.jpg`;
		img1.resize(200, 200).quality(100).write(dirFileTemp);

		if(fs.existsSync(dirFileTemp)) {
			let arrayColors = [];
			Jimp.read(dirFileTemp, (err, img2) => {
				for(let x=0; x<200; x++) {
					for(let y=0; y<200; y++) {
						let hex = img2.getPixelColor(x, y);
						let rgb = Jimp.intToRGBA(hex);
						arrayColors.push(Number(rgb.r));
						arrayColors.push(Number(rgb.g));
						arrayColors.push(Number(rgb.b));
					}
				}

				const objClasse = {Class: className, Pixels: arrayColors};

				let conteudo = fs.readFileSync('./model.json');
				let classificacoes = JSON.parse(conteudo.toString().trim());
				classificacoes.push(objClasse);
				fs.writeFileSync('./model.json', JSON.stringify(classificacoes));
				deletaArquivos(dirFileTemp);
			});
		}
	});
}

async function prever(file='') {
	let dirFile = `./teste/${file}`;
	await Jimp.read(dirFile, (err, img1) => {
		if(err) console.error(err);
		let dirFileTemp = `./temp/${file}`;
		img1.resize(200, 200).quality(100).write(dirFileTemp);

		if(fs.existsSync(dirFileTemp)) {
			Jimp.read(dirFileTemp, (err, img2) => {
				let arrayColors = [];
				for(let x=0; x<200; x++) {
					for(let y=0; y<200; y++) {
						let hex = img2.getPixelColor(x, y);
						let rgb = Jimp.intToRGBA(hex);
						arrayColors.push(Number(rgb.r));
						arrayColors.push(Number(rgb.g));
						arrayColors.push(Number(rgb.b));
					}
				}

				const tfPixels1 = tf.tensor(arrayColors);

				let classificacoes = [];
				try {
					let conteudo = fs.readFileSync('./model.json');
					classificacoes = JSON.parse(conteudo.toString().trim());
				}catch(e) {
					classificacoes = [];
				}

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
				console.log(`CLASSIFICAÇÃO: ${classificacao.toUpperCase()}`);
				deletaArquivos(dirFileTemp);

				const probabilidades = 
				`${percentPositivo}% de probabilidades de pertencer a classe ${classificacao}.\r\n` +
				`${percentNegativo}% de probabilidades de pertencer a outras classes.`;
				console.log(probabilidades);
			});
		}else {
			prever(file);
		}
	});
}

function treinar(classes=[]) {
	if(!fs.existsSync('./model.json'))
		fs.writeFileSync('./model.json', JSON.stringify([]));

	for(let c=0; c<classes.length; c++) {
		try {
			for(let i=1; i<=8; i++) {
				treino(classes[c], i);
			}
		}catch(e) {
			treinar([classes[c]]);
		}
	}
}

function salvarTreinamento(classes=[]) {
	treinar(classes);
	treinar(classes);
	console.log(`treinamento realizado com sucesso.`);
}

async function deletaArquivos(file='') {
	if(fs.existsSync(file)) await fs.unlinkSync(file);
}

function classificar(file='') {
	try { prever(file); }catch(e) { prever(file); }
}

//salvarTreinamento(['coca-cola', 'sprite']);
//classificar('coca-cola09.jpg');
//classificar('coca-cola10.jpg');
//classificar('sprite09.jpg');
classificar('sprite10.jpg');
