import { genAddress } from '@/assets/genAddress.js'
const bitcoin = require('bitcoinjs-lib')
const NETWORKS = require('./networks')
const wifList = require('./wif')
const fetchHelper = require('./fetch')
const regtest = NETWORKS.regtest
const testnet = NETWORKS.testnet

const spend = async function (m) {
  const network = testnet
  const address = await genAddress(m)
  const eccArray = getECPairFromWifArray(wifList.wifList, network)
  const n = eccArray.length
  const p2sh = createPayment(`p2wsh-p2ms(${m} of ${n})`, eccArray, network)
  const transInfo = await fetchHelper.genAddressUnspent(address)
  const inputData = await getInputData(p2sh.payment, 'p2wsh', transInfo)
  const spendable = transInfo.value_int
  const fees = 10000
  const totalToSend = spendable - fees
  const psbt = new bitcoin.Psbt({ network: network })
    .addInput(inputData)
    .addOutput({
      address: 'mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
      value: totalToSend
    })
  for (let i = 0; i < m; i++) {
    console.log(p2sh.keys[i])
    psbt.signInput(0, p2sh.keys[i])
  }
  // psbt.validateSignaturesOfInput(0)
  // psbt.finalizeAllInputs()
  // const tx = psbt.extractTransaction()
  // const txHex = tx.toHex()
  // const broadcast = await fetchHelper.broadcastTrans(txHex)
  // return broadcast
}

function getECPairFromWifArray (wifArray, network) {
  const eccPairArray = []
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
function getInputData (payment, redeemType, transInfo) {
  const amount = transInfo.value_int
  const hash = transInfo.txid
  const index = transInfo.n
  const script = Buffer.from(
    transInfo.script_pub_key.hex, 'hex'
  )
  const witnessUtxo = {
    script: script,
    value: amount
  }
  const mixin = { witnessUtxo }
  const mixin2 = {}
  switch (redeemType) {
    case 'p2wsh':
      mixin2.witnessScript = payment.redeem.output
      break
  }
  return {
    hash: hash,
    index: index,
    ...mixin,
    ...mixin2
  }
}

export { spend }
