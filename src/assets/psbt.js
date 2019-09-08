
const bitcoin = require('bitcoinjs-lib')
const NETWORKS = require('./networks')
const wifList = require('./wif')
const genAddressUnspent = require('./fetch')
const regtest = NETWORKS.regtest
const testnet = NETWORKS.testnet

let stuff = async function () {
  const network = testnet
  const eccArray = getECPairFromWifArray(wifList.wifList, network)
  const p2sh = createPayment('p2sh-p2wsh-p2ms(2 of 2)', eccArray, network)
  // const transInfo = await genAddressUnspent.genAddressUnspent('2MyG6iPpbbH5G7Fh7kcQpevLte3jhSy5Yke')
  const inputData = await getInputData(p2sh.payment, 'p2sh-p2wsh')
  const spendable = 10000
  const fees = spendable - 5000
  const totalToSend = spendable - fees
  const psbt = new bitcoin.Psbt({ network: network })
    .addInput(inputData)
    .addOutput({
      address: '2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE',
      value: totalToSend
    })
    .signInput(0, p2sh.keys[0])
    .signInput(0, p2sh.keys[1])
  psbt.finalizeAllInputs()
  const tx = psbt.extractTransaction()
  return tx
}

function getECPairFromWifArray (wifArray, network) {
  let eccPairArray = []
  for (let i = 0; i < wifArray.length; i++) {
    eccPairArray.push(bitcoin.ECPair.fromWIF(wifArray[i], network))
  }
  return eccPairArray
}
function createPayment (_type, myKeys, network) {
  network = network || regtest
  const splitType = _type.split('-').reverse()
  const isMultisig = splitType[0].slice(0, 4) === 'p2ms'
  const keys = myKeys || []
  let m
  if (isMultisig) {
    const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/)
    m = parseInt(match[1])
    let n = parseInt(match[2])
    if (keys.length > 0 && keys.length !== n) {
      throw new Error('Need n keys for multisig')
    }
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!myKeys && n > 1) {
      keys.push(bitcoin.ECPair.makeRandom({ network }))
      n--
    }
  }
  if (!myKeys) keys.push(bitcoin.ECPair.makeRandom({ network }))
  let payment
  splitType.forEach(type => {
    if (type.slice(0, 4) === 'p2ms') {
      payment = bitcoin.payments.p2ms({
        m,
        pubkeys: keys.map(key => key.publicKey).sort(),
        network
      })
    } else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
      payment = bitcoin.payments[type]({
        redeem: payment,
        network
      })
    } else {
      payment = bitcoin.payments[type]({
        pubkey: keys[0].publicKey,
        network
      })
    }
  })
  return {
    payment,
    keys
  }
}
async function getInputData (payment, redeemType) {
  const amount = 10000
  const hash = '9c72e8d196e13f643331e4d26c942640655128c1773a5f6c56cb70efb43f0628'
  const index = 1
  const script = Buffer.from(
    'a91441fb19425667dba47df50802d046f35520732c5487', 'hex'
  )
  const witnessUtxo = {
    script: script,
    value: amount }
  const mixin = { witnessUtxo }
  const mixin2 = {}
  switch (redeemType) {
    case 'p2sh-p2wsh':
      mixin2.witnessScript = payment.redeem.redeem.output
      mixin2.redeemScript = payment.redeem.output
      break
  }
  console.log(mixin2.witnessScript.toString('hex'))
  return {
    hash: hash,
    index: index,
    ...mixin,
    ...mixin2
  }
}

export { stuff }
