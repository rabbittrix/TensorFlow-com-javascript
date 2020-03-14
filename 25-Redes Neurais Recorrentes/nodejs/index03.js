const tf = require('@tensorflow/tfjs');

(async() => {
    const model = tf.sequential();

    const x = [[[1], [2], [3], [4], [5]]];
    const y = [[[6], [7], [8], [9], [10]]];

    const data = tf.tensor(x);
    const labels = tf.tensor(y);

    const rnn = tf.layers.simpleRNN({units: 1, returnSequences: true, activation: 'linear'});

    const inputLayer = tf.input({shape: [x[0].length, 1]});
    rnn.apply(inputLayer);

    model.add(rnn);

    model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.005)});
    await model.fit(data, labels, {epochs: 1500});

    const input = tf.tensor([[[1], [2], [3], [4], [5]]]);

    const output = model.predict(input).round();
    output.print();
})();
