import { useState } from "react";
import server from "./server";
import { personalKeys } from "./Wallet";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from '@noble/curves/secp256k1';

// get the private key from Wallet:
function addressToPrivate(knownAddress) {
  if (personalKeys['wallet address'] === knownAddress.toString()) {
    const associatedPrivateKey = personalKeys['private key'];
    return associatedPrivateKey;
  } else {
    setError("Address not valid.");
    return null;
  }
};

// get the hashed message:
function hashMessage(m) {
  const hashedMessage = keccak256(utf8ToBytes(m));
  return hashedMessage;
}

//get the signature: 
function signMessage(msg, add) {
  const signedMessage = secp256k1.sign(hashMessage(msg), addressToPrivate(add));
  return signedMessage;
}

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState(null);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const message = `I am sending ${sendAmount} ETH from ${address} to ${recipient}.`;

  //function for the "sign now" button and get the signature: 
  function handleSignNow() {
    const signature = signMessage(message, address);
    setSignature(signature);
  };

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        hashedmsg: hashMessage(message),
        sig: signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <button type="button" className="small-button" onClick={handleSignNow}>Sign Now</button>

      {signature && (
        <div>
          Signature: {signature.toCompactHex()}
        </div>
      )}

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
