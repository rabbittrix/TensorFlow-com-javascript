const tf = require('@tensorflow/tfjs');

(async() => {
    const model = tf.sequential();

    const x = tf.tensor([[[1], [2], [3], [4], [5]]]);
    const y = tf.tensor([[[6], [7], [8], [9], [10]]]);

    const rnn = tf.layers.simpleRNN({units: 1, returnSequences: true, activation: 'linear'});

    const inputLayer = tf.input({shape: [5, 1]});
    rnn.apply(inputLayer);

    model.add(rnn);

    model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.005)});
    await model.fit(x, y, {epochs: 1500});

    const input = tf.tensor([[[1], [2], [3], [4], [5]]]);

    const output = model.predict(input).round();
    output.print();
})();
