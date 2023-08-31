const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

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
  const { sender, recipient, amount, hashedmsg, sig } = req.body;

  //get public key and address from signature:
  const pubKey = sig.recoverPublicKey(hashedmsg);
  const verifiedAddress = toHex(keccak256(pubKey.slice(1)).slice(-20));

  if (sender !== verifiedAddress) {
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
