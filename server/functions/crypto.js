const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'affac3fa07e5745810609047c4422b39';
// const iv = crypto.randomBytes(16);
const iv = '8d9381cba73434fec1ab70099ae1747e'
const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        // iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {

    // const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

//uncomment this if a password needs to be hashed
//pass = {your_password}
//console.log(encrypt(pass))

module.exports = {
    encrypt,
    decrypt
};
