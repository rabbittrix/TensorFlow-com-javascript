let primeiraVEZ = true;
let iris = null;
let irisTesting = null;
let history = null;
let output = null;
let target = [1, 2, 3];

function toOutput(species='') {
	species = species.toString().trim();
	if(species=='setosa') return target[0];
	else if(species=='virginica') return target[1];
	else return target[2];
}

async function processar() {
	$('#loading').text('... processando, aguarde.');
	await $.ajax({
		dataType: 'json',
		url: 'iris/iris.json',
		success: function(data) { iris = data; }
	});

	await $.ajax({
		dataType: 'json',
		url: 'iris/iris-testing.json',
		success: function(data) { irisTesting = data; }
	});

	let trainingData = [];
	for(let i=0; i<iris.length; i++) {
		trainingData.push([iris[i].sepal_length,
						   iris[i].sepal_width,
						   iris[i].petal_length,
						   iris[i].petal_width]);
	}
	trainingData = tf.tensor(trainingData);

	let outputData = [];
	for(let i=0; i<iris.length; i++) {
		outputData.push([toOutput(iris[i].species)]);
	}
	outputData = tf.tensor(outputData);

	let testingData = [];
	for(let i=0; i<irisTesting.length; i++) {
		testingData.push([irisTesting[i].sepal_length,
						  irisTesting[i].sepal_width,
						  irisTesting[i].petal_length,
						  irisTesting[i].petal_width]);
	}
	testingData = tf.tensor(testingData);

	const model = tf.sequential();
	model.add(tf.layers.dense({inputShape: [4], units: 1, activation: 'linear'}));
	model.compile({loss: 'meanSquaredError', optimizer: 'sgd', metrics: ['accuracy']});

	$('.btn').prop('disabled', true);

	history = await model.fit(trainingData, outputData, {epochs: 200});
	output = await model.predict(testingData);

	$('.btn').prop('disabled', false);
	$('#loading').text('PROCESSAR');
}

async function acuracia_estatistica() {
	const headers = [
		'Setosa',
		'Virginica',
		'Versicolor'
	];

	let array = output.flatten().round().arraySync();

	const values = [target, array];

	const labels = tf.tensor(target);
	const predictions = tf.tensor(array);
	const acuracia = await tfvis.metrics.accuracy(labels, predictions);

	const tela1 = {tab: 'Resultados', name: `Acurácia: ${parseFloat(acuracia*100).toFixed(2)}%`};
	tfvis.render.table(tela1, {headers, values});

	const tela2 = {tab: 'Treinamento', name: 'Histórico de Treinamento'};
	tfvis.show.history(tela2, history, ['loss', 'acc']);

	if(!primeiraVEZ)
		await tfvis.visor().toggle();
	primeiraVEZ = false;
}
