const sm2 = require('sm-crypto').sm2;

let keypair = sm2.generateKeyPairHex()
let publicKey = keypair.publicKey
let privateKey = keypair.privateKey

console.log("公钥：", publicKey);
console.log("私钥：", privateKey);


console.log(sm2.doDecrypt('c738a4c4e9240b8970d82d3e9ed22770117868590a66c142baf7958e62e9602bfafe1d97924c0a24d069cd17ce607ffa35ef75c5a49d7d9c4c7808846d134c56f51444846c8a631f81707e0cbb3688875a6d71418f400174f75d946aface1ba228155890d9ef80ff699c74b7b05b1680ac9f6ed9d7b28dc9fbe7757cbfc6e64b02d0a167bdde16b996','ae0e556af8e1df87ac917fcb9d8271353c0ff0c436b0eed0b12f057996e8d488', 1));
