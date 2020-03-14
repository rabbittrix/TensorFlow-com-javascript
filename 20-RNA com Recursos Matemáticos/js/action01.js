function derivada(n) { return n.mul(tf.scalar(1).sub(n)); }

function tangenteHiperbolica(n) { return n.tanh(); }
function sigmoid(n) { return n.sigmoid(); }
function relu(n) { return n.relu(); }
function leakyRelu(n) { return n.leakyRelu(); }
function softmax(n) { return n.softmax(); }
function softplus(n) { return n.softplus(); }

function funcaoAtivacao(n) {
	const funcao = Number($('#ativacao').val());
	if(funcao == 0) return tangenteHiperbolica(n);
	else if(funcao == 1) return sigmoid(n);
	else if(funcao == 2) return relu(n);
	else if(funcao == 3) return leakyRelu(n);
	else if(funcao == 4) return softmax(n);
	else return softplus(n);
}

function ApproximationFunction() {
	$('#linhas').html('');
	let input = Number($('#entrada').val());
	if(input <= 0) input = 0.1;
	const tfInput = tf.scalar(input);
	const target = Number($('#busca').val());
	const tfTarget = tf.scalar(target);
	let tfWeight = tf.randomUniform([1, 1]).flatten();
	const epochs = Number($('#epocas').val());

	let lines = '';
	for(let i=1; i<=epochs; i++) {
		let tfOutput = funcaoAtivacao(tfInput.mul(tfWeight));
		let tfError = tfTarget.sub(tfOutput);
		tfWeight = tfWeight.add(tfInput.mul(derivada(tfError)));
		lines += 
		"<tr>" +
			"<td>" + i + "</td>" + 
			"<td>" + parseFloat(tfError.abs().arraySync()).toFixed(4) + "</td>" +
			"<td>" +
					 parseFloat(tfOutput.arraySync()).toFixed(8) + 
					 " | " +
					 parseFloat(tfOutput.round().arraySync()).toFixed(0) + 
			"</td>" +
		"</tr>";

		if(corte(target, tfOutput)) i = epochs+1;
	}

	$('#linhas').html(lines);

	if(input == 0.1) input = 0;
	$('#desc_entrada').text('entrada: ' + input);
	$('#desc_busca').text('busca: ' + target);
	$('#desc_epocas').text('épocas: ' + epochs);
}

function corte(target, output) {
	const strTarget = target.toString().trim();
	if(strTarget.indexOf('.') >= 0) {
		target = parseFloat(target).toFixed(2);
		output = parseFloat(output.arraySync()).toFixed(2);
	}else {
		target = parseFloat(target).toFixed(0);
		output = parseFloat(output.arraySync()).toFixed(0);
	}
	if(target == output) return true; return false;
}
