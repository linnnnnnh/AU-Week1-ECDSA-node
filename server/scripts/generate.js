const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.secp256k1.utils.randomPrivateKey();
console.log("private key: ", toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log("public key: ", toHex(publicKey));

const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
console.log("address: ", address);

// private key:  fdee16480d7f616dd7c72bebe7c42d5954f7c799b084e9c7133929bf10b5430d
// public key:  03f882882f75fbca3f8cc1efd3fffb1621dd50d68417b2d5b0ff35a04ba8b35471
// address:  9b862c8aed6d056c951eab8b192a36c27c149147

