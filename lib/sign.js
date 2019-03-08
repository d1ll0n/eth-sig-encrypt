const ethUtil = require('ethereumjs-util');

function signMsg(web3, from, msg) {
  return new Promise((resolve, reject) => {
    if (!from.privateKey) {
      // We don't have access to the private key, so we will call the sign method through the provider
      const params = [ethUtil.bufferToHex(new Buffer(msg, 'utf8')), from]
      web3.currentProvider.sendAsync({
        id: 1,
        method: 'personal_sign',
        params,
        from: from,
      }, (err, result) => {
        if (err) reject(err)
        else resolve(result.result)
      })
    } else {
      // We do have access to the private key
      try {
        const signature = web3.eth.accounts.sign(msg, from.privateKey)
        resolve(signature)
      } catch(e) {
        reject(e)
      }
    }
    
  })
}

module.exports = signMsg

/*
web3.eth.getAccounts(function (err, accounts) {

  if (!accounts) return

  signMsg(msgParams, accounts[0])

})
web3.currentProvider.sendAsync({
    method: 'eth_signTypedData',
    params: [msgParams, from],
    from: from,
  }, function (err, result) {

    if (err) return console.error(err)
    if (result.error) {
      return console.error(result.error.message)
    }

    const recovered = sigUtil.recoverTypedSignature({
      data: msgParams,
      sig: result.result 
    })

    if (recovered === from ) {
      alert('Recovered signer: ' + from)
    } else {
      alert('Failed to verify signer, got: ' + result)
    }
  })
*/