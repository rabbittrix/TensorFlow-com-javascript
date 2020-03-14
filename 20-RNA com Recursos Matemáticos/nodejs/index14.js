const nettf = require('./RNATensorFlow');

const config = {
	epochs: 400, 
	activation: 'sigmoid', 
	bias: 0, 
	hiddenLayers: 1, 
	model: 'dados11',
	dense: true,
	nOutputs: 1,
	formatIO: true
};

const net = new nettf(config);

const x = [[10, 10], [10, 111], [111, 10], [111, 111]];
const y = [[0], [1], [1], [0]];

//net.fit(x, y);

console.log(`10  XOR  10 = ${parseFloat(net.predict([10,   10])).toFixed(0)}`);
console.log(`10  XOR 111 = ${parseFloat(net.predict([10,  111])).toFixed(0)}`);
console.log(`111 XOR  10 = ${parseFloat(net.predict([111,  10])).toFixed(0)}`);
console.log(`111 XOR 111 = ${parseFloat(net.predict([111, 111])).toFixed(0)}`);
