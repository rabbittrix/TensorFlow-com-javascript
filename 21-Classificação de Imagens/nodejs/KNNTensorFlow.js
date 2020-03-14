const tf = require('@tensorflow/tfjs');
const Jimp = require('jimp');
const fs = require('fs');
const moveFile = require('move-file');

module.exports = class KNNClassImage {
	constructor(Config={}) {
		(Config.dirTrain) ? this.dirTrain = Config.dirTrain.toString().trim() : this.dirTrain = './treino/';
		(Config.dirTest) ? this.dirTest = Config.dirTest.toString().trim() : this.dirTest = './teste/';
		(Config.dirClass) ? this.dirClass = Config.dirClass.toString().trim() : this.dirClass = './classificado/';
		(Config.model) ? this.model = Config.model.toString().trim() : this.model = './train.json';
		(Config.limitFiles) ? this.limitFiles = Number(Config.limitFiles) : this.limitFiles = 0;
		(Config.width) ? this.width = Number(Config.width) : this.width = 200;
		(Config.height) ? this.height = Number(Config.height) : this.height = 200;

		if(!fs.existsSync('./temp')) fs.mkdirSync('./temp');
	}

	async treino(className='', prefix=0) {
		let DirTrain = this.dirTrain;
		let Model = this.model;
		let Width = this.width;
		let Height = this.height;
		if(DirTrain.slice(-1) != '/') DirTrain = DirTrain+'/';
		const dir = `${DirTrain}${className}`;
		let index = prefix.toString();
		if(index.length <= 1) index = '0'.concat(index);

		let dirFile = `${dir}/${className}${index}.jpg`;
		try {
			await Jimp.read(dirFile, (err, img1) => {
				if(err) console.error(err);
				let dirFileTemp = `./temp/${className}${index}.jpg`;
				img1.resize(Width, Height).quality(100).write(dirFileTemp);

				if(fs.existsSync(dirFileTemp)) {
					let arrayColors = [];
					Jimp.read(dirFileTemp, (err, img2) => {
						for(let x=0; x<Width; x++) {
							for(let y=0; y<Height; y++) {
								try {
									let hex = img2.getPixelColor(x, y);
									let rgb = Jimp.intToRGBA(hex);
									arrayColors.push(Number(rgb.r));
									arrayColors.push(Number(rgb.g));
									arrayColors.push(Number(rgb.b));
								}catch(e) { this.treino(className, prefix); }								
							}
						}

						const objClasse = {Class: className, Pixels: arrayColors};
						try {
							let conteudo = fs.readFileSync(Model);
							let classificacoes = JSON.parse(conteudo.toString().trim());
							classificacoes.push(objClasse);
							fs.writeFileSync(Model, JSON.stringify(classificacoes));
							this.deletaArquivos(dirFileTemp);
						}catch(e) { this.treino(className, prefix); }
					});
				}
			});
		}catch(e) { this.treino(className, prefix); }
	}

	async prever(file='') {
		let DirTest = this.dirTest;
		let Model = this.model;
		let DirClass = this.dirClass;
		let Width = this.width;
		let Height = this.height;
		if(DirTest.slice(-1) != '/') DirTest = DirTest+'/';
		if(DirClass.slice(-1) != '/') DirClass = DirClass+'/';
		let dirFile = `${DirTest}${file}`;
		try {
			await Jimp.read(dirFile, (err, img1) => {
				if(err) console.error(err);
				let dirFileTemp = `./temp/${file}`;
				img1.resize(Width, Height).quality(100).write(dirFileTemp);

				if(fs.existsSync(dirFileTemp)) {
					Jimp.read(dirFileTemp, (err, img2) => {
						let arrayColors = [];
						for(let x=0; x<Width; x++) {
							for(let y=0; y<Height; y++) {
								try {
									let hex = img2.getPixelColor(x, y);
									let rgb = Jimp.intToRGBA(hex);
									arrayColors.push(Number(rgb.r));
									arrayColors.push(Number(rgb.g));
									arrayColors.push(Number(rgb.b));
								}catch(e) { this.prever(file); }
							}
						}

						const tfPixels1 = tf.tensor(arrayColors);

						let classificacoes = [];
						try {
							let conteudo = fs.readFileSync(Model);
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
						this.deletaArquivos(dirFileTemp);
						(async() => {
							await moveFile(dirFile, `${DirClass}${classificacao}/${file}`);
						})();
						console.log(`${file} classificada com sucesso.`);
					});
				}else {
					this.prever(file);
				}
			});
		}catch(e) { this.prever(file); }
	}

	treinar(classes=[]) {
		let LimitFiles = this.limitFiles;
		let Model = this.model;
		if(!fs.existsSync(Model))
			fs.writeFileSync(Model, JSON.stringify([]));

		for(let c=0; c<classes.length; c++) {
			try {
				for(let i=1; i<=LimitFiles; i++) {
					try { this.treino(classes[c], i); }
					catch(e) { this.treino(classes[c], i); }	
				}
			}catch(e) {
				this.treinar([classes[c]]);
			}
		}
	}

	saveTrain(classes=[]) {
		this.treinar(classes);
		this.treinar(classes);
		console.log(`treinamento realizado com sucesso.`);
	}

	async deletaArquivos(file='') {
		if(fs.existsSync(file)) await fs.unlinkSync(file);
	}

	classify(file='') {
		try {
			this.prever(file);
		}catch(e) {
			try { this.prever(file); }catch(e) { this.prever(file); }
		}
	}
}
