$('#eixoX').text('');
$('#eixoY').text('');

function executar() {
	let eixoX = $('#eixoX').val();
	let eixoY = $('#eixoY').val();

	let arrX = eixoX.split(',');
	let arrY = eixoY.split(',');

	let vetorX = converteNumero(arrX);
	let vetorY = converteNumero(arrY);

	let tamX = vetorX.length;
	let tamY = vetorY.length;

	let inputX = vetorX.slice(0, tamY);
	let inputY = vetorY;
	let inputZ = vetorX.slice(tamY, tamX);

	let dif = tamX - tamY;

	if(dif > 0) {
		const epochs = 500;
		let train;
		const model = tf.sequential();
		 
		function assemply() {
		   const x = tf.tensor2d(inputX, [inputX.length, 1]);
		   const y = tf.tensor2d(inputY, [inputY.length, 1]);
		   model.add(tf.layers.dense({units: 1, inputShape: [1]}));
		   model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
		   train = model.fit(x, y, {epochs: epochs});
		}

		function predict() {    
		   return train.then(()=> { return model.predict(tf.tensor2d(inputZ, [inputZ.length, 1])); }); 
		}

		function show() {
			predict().then(function(res) {
			   let output = [];
			   for(let i=0; i<3; i++) {
			      let number = Math.ceil(res.get([i]));
			      output.push(number);
			   }

			   let strArray = 
			                 output.toString().
			                 replace(/\[/g, '').
			                 replace(/\]/g, '').
			                 replace(/,/g, ', ').trim();

			   let strConcat = eixoY+', '+strArray 

			   console.log(strConcat);
			});   
		}

		assemply();
		show(); 
	}
}

function tensorToArray(tensor) {
	let array = [];
	let strTensor = tensor.toString().replace('Tensor', '').trim();
	eval('array = ' + strTensor);
	return array;
}

function arrayToTensor(array) {
	let tensor = tf.tensor(array);
	return tensor;
}

function converteNumero(array) {
	let temp = [];
	for(let i=0; i<array.length; i++) {
		temp.push(parseFloat(array[i].toString().trim()));
	}
	return temp;
}
