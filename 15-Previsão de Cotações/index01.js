const tf = require("@tensorflow/tfjs");
const fs = require("fs");

let arquivo = fs.readFileSync("cotacao-do-dolar.csv", { encoding: "utf8" });
arquivo = arquivo.toString().trim();

const linhas = arquivo.split("\r\n");
let X = [];
let Y = [];
let qtdLinhas = 0;

for (let l = 1; l < linhas.length; l++) {
  let celulas1 = [];
  if (qtdLinhas == linhas.length - 2)
    celulas1 = ["31.12.2018", 3.8813, 3.8813, 3.8813, 3.8813];
  else celulas1 = linhas[l + 1].split(";");

  const celulas2 = linhas[l].split(";");

  const FechamentoX = Number(celulas1[1]);
  const AberturaX = Number(celulas1[2]);
  const MaximaX = Number(celulas1[3]);
  const MinimaX = Number(celulas1[4]);

  X.push([FechamentoX, AberturaX, MaximaX, MinimaX]);

  const FechamentoY = Number(celulas2[1]);
  const AberturaY = Number(celulas2[2]);
  const MaximaY = Number(celulas2[3]);
  const MinimaY = Number(celulas2[4]);

  Y.push([FechamentoY, AberturaY, MaximaY, MinimaY]);

  qtdLinhas++;
}

const model = tf.sequential();
const inputLayer = tf.layers.dense({ units: 4, inputShape: [4] });
model.add(inputLayer);
model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

const x = tf.tensor(X, [qtdLinhas, 4]);
const y = tf.tensor(Y);

const arrInput = [[3.9285, 3.9708, 3.9781, 3.9251]]; // 08.05.2019
//const arrInput = [[3.9466, 3.9283, 3.9818, 3.9283]]; // 09.05.2019
const input = tf.tensor(arrInput, [1, 4]);

model.fit(x, y, { epochs: 500 }).then(() => {
  let output = model.predict(input).dataSync();
  output = ordenaDados(output);

  console.log(`PREÇO DAS COTAÇOES`);
  console.log(`Fechamento: R$ ${Number(output[0]).toFixed(4)}`);
  console.log(`Abertura:   R$ ${Number(output[1]).toFixed(4)}`);
  console.log(`Máxima:     R$ ${Number(output[2]).toFixed(4)}`);
  console.log(`Mínima:     R$ ${Number(output[3]).toFixed(4)}`);
});

function ordenaDados(array) {
  function sortNumber(a, b) {
    return a - b;
  }

  let fechamento = array[0];
  let abertura = array[1];
  let maxima = array[2];
  let minima = array[3];

  let cotacoes = [fechamento, abertura, maxima, minima];
  cotacoes = cotacoes.sort(sortNumber);

  let menor = cotacoes[0];
  let maior = cotacoes[3];

  if (fechamento < minima) fechamento = minima;
  if (abertura < minima) abertura = minima;
  if (maxima < minima) maxima = minima;
  minima = menor;

  if (fechamento > maxima) fechamento = maxima;
  if (abertura > maxima) abertura = maxima;
  if (minima > maxima) minima = maxima;
  maxima = maior;

  cotacoes = [fechamento, abertura, maxima, minima];
  return cotacoes;
}
