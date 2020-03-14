const tf = require('@tensorflow/tfjs');

(async() => {
    const model = tf.sequential();

    const x = tf.tensor([[[1], [2], [3], [4], [5]], [[11], [12], [13], [14], [15]]]);
    const y = tf.tensor([[[6], [7], [8], [9], [10]], [[16], [17], [18], [19], [20]]]);

    const rnn = tf.layers.simpleRNN({units: 1, returnSequences: true, activation: 'linear'});

    const inputLayer = tf.input({shape: [5, 1]});
    rnn.apply(inputLayer);

    model.add(rnn);

    model.compile({loss: 'meanSquaredError', optimizer: tf.train.sgd(.0008)});
    await model.fit(x, y, {epochs: 5000});

    const input = tf.tensor([[[1], [2], [3], [4], [5]], [[11], [12], [13], [14], [15]]]);

    const output = model.predict(input).round();
    output.print();
})();
