desenhar();

let SRC = './img/TensorFlow.png';
let model = null;
cocoSsd.load().then(result => {
	model = result;
	$('#carregamento').text('Detecção de Objetos com COCO-SSD');
});

function abrir() {
	let file = document.querySelector('input[type=file]').files[0];
	let reader = new FileReader();

	if(file) {
		reader.readAsDataURL(file);
	}else {
		desenhar('./img/TensorFlow.png');
	}

	reader.onloadend = function() {
		desenhar(reader.result);
		SRC = reader.result;
	}
}

function prever() {
	$('#botao').text('... processando, aguarde.');
	const img = document.getElementById('desenho');

	let posicoes = [];
	model.detect(img).then(predictions => {
		console.log(predictions);

		for(let i=0; i<predictions.length; i++) {
			posicoes.push({x: predictions[i].bbox[0],
						   y: predictions[i].bbox[1],
						   w: predictions[i].bbox[2],
						   h: predictions[i].bbox[3],
						   c: predictions[i].class});
		}

		desenhar(SRC, posicoes);
	});
}

function desenhar(url='./img/TensorFlow.png', posicoes=[]) {
	const desenho = document.getElementById('desenho');
	const context = desenho.getContext('2d');

	let img = new Image();
	img.crossOrigin = 'anonymous'
	img.src = url;
	img.onload = function() {
		context.drawImage(img, 0, 0, 400, 300);

		for(let i=0; i<posicoes.length; i++) {
			context.strokeStyle = '#01DF01';
			context.lineWidth = 2;
			context.font = 'bold 12px arial';
			context.fillStyle = '#01DF01';
			context.fillText(posicoes[i].c.toUpperCase(), posicoes[i].x+4, posicoes[i].y+14);
			context.strokeRect(posicoes[i].x, posicoes[i].y, posicoes[i].w, posicoes[i].h);
		}

		$('#botao').text('Detectar Objetos');
	}
}
