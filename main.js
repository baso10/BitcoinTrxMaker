const bitcoinService = require("./bitcoinService");
const blockchainWeb = require("./blockchainWeb");


async function transferBalance(publicKeyFrom, privateKeyFrom, publicKeyTo) {
  let test = 0;
  if (publicKeyFrom.startsWith("tb1") ||
          publicKeyFrom.startsWith("tpub") ||
          publicKeyFrom.startsWith("2") ||
          publicKeyFrom.startsWith("m") ||
          publicKeyFrom.startsWith("n")) {
    test = 1;
  }


  const data = await blockchainWeb.getBalance(publicKeyFrom, test);
  if (!data) {
    return;
  }
  var balance = data.balance + data.unconfirmed_balance;
  if (balance > 0) {
    const unspentOutputs = await blockchainWeb.getUnspentOutputs(publicKeyFrom, test);
    if (!unspentOutputs) {
      return;
    }

    var outputs = [];
    var txRef = blockchainWeb.getTxRef(unspentOutputs);
    if (txRef && txRef.length > 0)
    {
      for (const tx of txRef)
      {
        outputs.push({
          txHash: tx.tx_hash,
          txIndex: tx.tx_output_n,
          amount: tx.value
        });
      }
    }

    if (!outputs.length) {
      return;
    }

    //fee
    const feePerByte = await blockchainWeb.getFeePerByte();

    var trxInputs = [];
    var totalAmount = 0;
    for (const output of outputs)
    {
      trxInputs.push({
        txHash: output.txHash,
        txIndex: output.txIndex,
        amount: output.amount,
        publicKey: publicKeyFrom,
        privateKey: privateKeyFrom
      });
      totalAmount += output.amount;
    }

    var trxOutputs = [
      {
        publicKey: publicKeyTo, //To address
        amount: totalAmount
      }
    ];

    var network = test ? "test" : "";


    //calculate fee
    console.log("calculate fee");
    const tx = bitcoinService.signTx(trxInputs, trxOutputs, network)
    const vSize = tx.size;
    console.log("vSize: " + vSize);
    var feeSatoshi = feePerByte * vSize;
    console.log("feeSatoshi: " + feeSatoshi);

    if (!feeSatoshi) {
      console.log("feeSatoshi is empty")
      return null;
    }
    const outLength = trxOutputs.length;
    const feePerOutput = feeSatoshi / outLength;
    for (var i = 0; i < outLength; i++) {
      trxOutputs[i].amount = trxOutputs[i].amount - feePerOutput;
      console.log("outputs[i].amount: " + trxOutputs[i].amount);
    }

    //final sign
    const signResult = bitcoinService.signTx(trxInputs, trxOutputs, network);
    console.log(signResult);

    //push trx
    const pushResponse = await blockchainWeb.pushTrx(signResult.rawHash, test);

    return {pushResponse: pushResponse, tx: signResult};
  }

  return null;
}

function createWallet(network) {
  console.log("createWallet: " + network)
  var wallet = bitcoinService.createWallet(network);
  console.log("createWallet: wallet created");

  return wallet;
}


var wallet = createWallet("test");
console.log(wallet)


transferBalance(
        "tb1qvf7ydmztc33fef653wdjx37euvf3ae9y6al6al",
        "cPjtFKXchdwr1efVtdbruBy3RF4dTLJoED7p8MXF6hw1R1ypYM4f",
        "tb1q5rg9st5qtyfql944yclshac2pc2zcfprylt037"
        ).then((data) => {
  console.log(data)
});
