const Web3 = require("web3");
const { encrypt, decrypt } = require("./lib/encryption");
const signMsg = require("./lib/sign");

/**
 * This function decodes json string to json object
 * @param  {String} str
 */
const decode = str => JSON.parse(str);

/**
 * This function encodes json object to json string
 * @param  {Any} data
 */
const encode = data => (typeof data == "string" ? data : JSON.stringify(data));

/**
 * This function generates symmetric key based
 * @param  {web3.providers} web3 Web3 provider
 * @param  {web3.account} account Web3 account object
 * @param  {Int} salt Integer for more randomness
 */
function getSymmetricKey(web3, account, salt) {
  return signMsg(web3, account, salt);
}

/**
 * This function encrypts and signs the message
 * @param  {web3.providers} web3 Web3 provider
 * @param  {web3.account} account Web3 account object
 * @param  {String} msg Message to send
 * @param  {Int} salt Integer for more randomness
 * @return {} cipher TODO: Confirm type here
 */
async function sigEncrypt(web3, account, msg, salt) {
  let key = await getSymmetricKey(web3, account, salt);
  key = key.signature;
  const data = encode(msg);
  const cipher = encrypt(data, key);
  return cipher;
}

/**
 * This function decrypts encrypted and signed message
 * @param  {web3.providers} web3 Web3 provider
 * @param  {web3.account} account Web3 account object
 * @param  {Int} cipher Shared symmetric key
 * @param  {Int} salt Integer for more randomness
 * @return {} result TODO: Confirm type here
 */
async function sigDecrypt(web3, account, cipher, salt) {
  let key = await getSymmetricKey(web3, account, salt);
  key = key.signature;
  const data = decrypt(cipher, key);
  let result;
  try {
    result = decode(data);
  } catch (e) {
    result = data;
  }
  return result;
}

/**
 * This function constructs Web3 http provider
 * @param  {Web3.HttpProvider} newWeb3.providers.HttpProvider(providerUrl
 */
const constructWeb3 = providerUrl =>
  new Web3(new Web3.providers.HttpProvider(providerUrl));

/**
 * This class is the message encryption/decryption engine
 */
class EthSigEncryption {
  constructor(web3, account, salt) {
    if (typeof web3 == "string") this.web3 = constructWeb3(web3);
    else this.web3 = web3;
    this.account = account;
    this.salt = salt;
  }

  /**
   * This function encrypts a message
   * @param {String} message Message to send
   * @param {Object} options Options for encrypting the message
   * @return {} TODO: confirm type sigEncrypt Encrypted message
   */
  async encrypt(message, options) {
    const { web3, account, salt } = options ? options : this;
    return sigEncrypt(web3, account, message, salt);
  }

  /**
   * This function decrypts a message
   * @param {Int} cipher Shared Symmetric key
   * @param {Object} options Options for decrypying the message
   * @return {} TODO: confirm type sigDecrypt Decrypted message
   */
  async decrypt(cipher, options) {
    const { web3, account, salt } = options ? options : this;
    return sigDecrypt(web3, account, cipher, salt);
  }
}

module.exports = {
  EthSigEncryption,
  sigEncrypt,
  sigDecrypt,
  getSymmetricKey,
  signMsg,
  encrypt,
  decrypt,
  constructWeb3
};
