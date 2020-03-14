const ClassImage = require('./KNNTensorFlow');

const config = {
	dirTrain: './treino/',
	dirTest: './misturado/',
	dirClass: './classificado/',
	model: './train.json',
	limitFiles: 8,
	width: 200,
	height: 200
};

const classImage = new ClassImage(config);

//classImage.saveTrain(['cachorro', 'gato']);

for(let i=1; i<=4; i++) {
	classImage.classify(`img0${i}.jpg`);
}
