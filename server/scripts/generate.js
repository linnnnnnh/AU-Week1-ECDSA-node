const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
// const { utf8ToBytes } = require("ethereum-cryptography/utils");
// const { secp256k1 } = require('@noble/curves/secp256k1');

const privateKey = secp.secp256k1.utils.randomPrivateKey();
console.log("private key: ", toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log("public key: ", toHex(publicKey));

const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
console.log("address: ", address);

// private key:  fdee16480d7f616dd7c72bebe7c42d5954f7c799b084e9c7133929bf10b5430d
// public key:  03f882882f75fbca3f8cc1efd3fffb1621dd50d68417b2d5b0ff35a04ba8b35471
// address:  9b862c8aed6d056c951eab8b192a36c27c149147

// function hashMessage(m) {
//     const hashedMessage = keccak256(utf8ToBytes(m));
//     return hashedMessage;
// };

// function signMessage(msg, pv) {
//     const signedMessage = secp256k1.sign(hashMessage(msg), pv);
//     return signedMessage;
// }

// const signed = signMessage("I am sending money", "fdee16480d7f616dd7c72bebe7c42d5954f7c799b084e9c7133929bf10b5430d");
// console.log(signed);


// Signature {
//     r: 59490738666876360333452128842142231864370964931766951051169365678098624238465n,
//     s: 57640234855806971242361667040272980564218468887019825379959193711309236683882n,
//     recovery: 0
//   }


//hashed message type:
// Uint8Array(32) [
//    53,  28,  41, 251, 132,  84, 231, 189,
//    53, 126, 220, 234,   2, 188,  25,  42,
//   224,  12, 177,  69,  39, 242, 231, 190,
//   220,  65,  69, 216,  16,  56, 132, 184
// ]