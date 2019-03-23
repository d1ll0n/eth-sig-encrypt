const crypto = require('crypto')
const scrypt = require("scrypt");

const algorithm = 'aes-256-cbc'

const hash = data => crypto.createHash('sha256').update(data).digest('hex').slice(0, 32)

const newIv = () => Buffer.alloc(16, 0)

function encrypt(data, password) {
  const iv = newIv()
  const key = hash(password)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

function decrypt(cipher, password, salt) {
  const iv = newIv()
  const key = hash(password, salt)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(cipher, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = {
  encrypt,
  decrypt
}