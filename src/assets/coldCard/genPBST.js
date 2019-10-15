import { getPubkeyArray, genAddress } from '@/assets/coldCard/genAddress.js'
import { decodePsbtHex } from '@/assets/coldCard/psbtEdit.js'
const bitcoin = require('bitcoinjs-lib')
const NETWORKS = require('./networks')
const fetchHelper = require('./fetch')
const regtest = NETWORKS.regtest
const testnet = NETWORKS.testnet

async function getPBST () {
  const m = 2
  const n = 2
  const index = 0
  const pubkeyArray = getPubkeyArray(index)
  const network = testnet
  const address = await genAddress(index)
  const p2wsh = await createPayment(`p2wsh-p2ms(${m} of ${n})`, pubkeyArray, network)
  const transInfo = await fetchHelper.genAddressUnspent(address)
  const inputData = await getInputData(p2wsh.payment, 'p2wsh', transInfo)
  const spendable = transInfo.value_int
  const fees = 10000
  const totalToSend = spendable - fees
  const psbt = new bitcoin.Psbt({ network: network })
    .addInput(inputData)
    .addOutput({
      address: 'mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
      value: totalToSend
    })
  const psbtBaseText = decodePsbtHex(psbt.toHex())
  return psbtBaseText
}

async function createPayment (_type, myKeys, network) {
  network = network || regtest
  const splitType = _type.split('-').reverse()
  const isMultisig = splitType[0].slice(0, 4) === 'p2ms'
  const keys = await myKeys
  let m
  if (isMultisig) {
    const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/)
    m = parseInt(match[1])
    const n = parseInt(match[2])
    if (keys.length > 0 && keys.length !== n) {
      throw new Error('Need n keys for multisig')
    }
  }
  let payment
  splitType.forEach(type => {
    if (type.slice(0, 4) === 'p2ms') {
      payment = bitcoin.payments.p2ms({
        m,
        pubkeys: keys.map(key => key),
        network
      })
    } else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
      payment = bitcoin.payments[type]({
        redeem: payment,
        network
      })
    } else {
      payment = bitcoin.payments[type]({
        pubkey: keys[0],
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
export { getPBST }
