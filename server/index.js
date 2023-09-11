const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
// const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require('@noble/curves/secp256k1');
// const { secp } = require("ethereum-cryptography/secp256k1");


app.use(cors());
app.use(express.json());

//also store the address + amounts on the server side:
const balances = {
  "9b862c8aed6d056c951eab8b192a36c27c149147": 100,
  "0x1": 10,
  "0x2": 50,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, hashmsg, sig } = req.body;

  //get public key and address from signature:

  const initialSig = secp256k1.Signature.fromCompact(sig);
  initialSig.recovery = 0;
  const pubKeyPoint = initialSig.recoverPublicKey(hashmsg);
  const pubKey = new secp256k1.ProjectivePoint(pubKeyPoint.px, pubKeyPoint.py, pubKeyPoint.pz);
  const isValid = secp256k1.verify(sig, hashmsg, pubKey.toRawBytes());

  if (!isValid) {
    res.status(400).send({ message: "Wrong signature!" });
    return;
  } else {
    setInitialBalance(sender);
    setInitialBalance(recipient);
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
