const crypto = require('crypto')
const scrypt = require("scrypt");

const scryptParameters = scrypt.paramsSync(0.3);
const algorithm = 'aes-192-cbc'

const calcKey = (password, salt = '53fc289cc211dde0a852d60a8157444ef10bf29464def') => 
  scrypt.hashSync(password, scryptParameters, 24, salt)

const newIv = () => Buffer.alloc(16, 0)

function encrypt(data, password) {
  const iv = newIv()
  const key = calcKey(password)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

function decrypt(cipher, password, salt) {
  const iv = newIv()
  const key = calcKey(password, salt)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(cipher, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = {
  encrypt,
  decrypt
}