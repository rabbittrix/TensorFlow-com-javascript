let ativar = false;
let canvas = document.getElementById('canvas');
let video = document.getElementById('video');
let img = document.getElementById('img');
let context = canvas.getContext('2d');

let model = null;
cocoSsd.load().then(result => {
	model = result;
	$('#carregamento').text('Detecção de Objetos com COCO-SSD.');
});

function play() {
	img.style.display = 'none';
	canvas.style.display = 'block';
	video.volume = 0.01;
	video.play();
	ativar = true;
}
function pause() {
	video.pause();
	ativar = false;
}

async function detectar() {
	if(ativar) {
		let posicoes = [];

		await model.detect(canvas).then(predictions => {
			for(let i=0; i<predictions.length; i++) {
				posicoes.push({x: predictions[i].bbox[0],
							   y: predictions[i].bbox[1],
							   w: predictions[i].bbox[2],
							   h: predictions[i].bbox[3],
							   c: predictions[i].class});
			}
			for(let i=0; i<posicoes.length; i++) {
				context.strokeStyle = '#01DF01';
				context.lineWidth = 2;
				context.font = 'bold 12px arial';
				context.fillStyle = '#01DF01';
				context.fillText(posicoes[i].c.toUpperCase(), posicoes[i].x+4, posicoes[i].y+14);
				context.strokeRect(posicoes[i].x, posicoes[i].y, posicoes[i].w, posicoes[i].h);
			}
		});
	}
}

video.addEventListener('loadedmetadata', function() {
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
});
video.addEventListener('play', function() {
	let $this = this;
	(async function loop() {
		if(!$this.paused && !$this.ended) {
			context.drawImage($this, 0, 0);
			setTimeout(loop, 1000 / 30); // 30fps
			await detectar();
		}
	})();
});
