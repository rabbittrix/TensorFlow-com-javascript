const tf = require('@tensorflow/tfjs');

(async() => {
	let classe1 = tf.tensor([[10], [15], [12], [17], [14]]);
	let classe2 = tf.tensor([[22], [31], [18], [40], [44]]);
	let classe3 = tf.tensor([[45], [50], [47], [51], [72]]);

	let classes = [classe1, classe2, classe3];

	let procura = tf.tensor([[21], [31], [17], [38], [44]]);

	let menor = Infinity;
	let index = 0;
	for(let i=0; i<classes.length; i++) {
		let diferenca = await Number(procura.sub(classes[i]).abs().sum().arraySync());
		if(diferenca<menor) {
			menor = diferenca;
			index = i;
		}
	}

	console.log(`classificado como: classe${index+1}`);
	classes[index].print();
})();
