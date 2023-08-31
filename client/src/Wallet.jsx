import server from "./server";


//store all 3 of those in an object on the client side: 
export const personalKeys = {
  'private key': "fdee16480d7f616dd7c72bebe7c42d5954f7c799b084e9c7133929bf10b5430d",
  'public key': "03f882882f75fbca3f8cc1efd3fffb1621dd50d68417b2d5b0ff35a04ba8b35471",
  'wallet address': "9b862c8aed6d056c951eab8b192a36c27c149147"
};

//Use the address to search for the associated private key from the client side:
function addressToPublic(knownAddress) {
  if (personalKeys['wallet address'] === knownAddress.toString()) {
    const associatedPublicKey = personalKeys['public key'];
    return associatedPublicKey;
  } else {
    setError("Address not valid.");
    return null;
  }
};

function Wallet({ address, setAddress, balance, setBalance, publicKey, setPublicKey }) {
  async function onChange(evt) {

    const address = evt.target.value;
    setAddress(address);

    const publicKey = addressToPublic(address);
    setPublicKey(publicKey);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet address:
        <input placeholder="Type in your wallet address" value={address} onChange={onChange}></input>
      </label>

      <div>
        Public key: {publicKey.slice(0, 10)}...
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
