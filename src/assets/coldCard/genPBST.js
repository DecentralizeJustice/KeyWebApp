import { getPubkeyArray, genAddress } from '@/assets/coldCard/genAddress.js'
const bitcoin = require('bitcoinjs-lib')
const NETWORKS = require('./networks')
const fetchHelper = require('./fetch')
const regtest = NETWORKS.regtest
const testnet = NETWORKS.testnet

async function getPBST () {
  const m = 2
  const n = 2
  const index = 0
  const pubkeyArray = await getPubkeyArray(index)
  const network = testnet
  const address = await genAddress(index)
  const p2wsh = await createPayment(`p2wsh-p2ms(${m} of ${n})`, pubkeyArray, network)
  const transInfo = await fetchHelper.genAddressUnspent(address)
  const inputData = await getInputData(p2wsh.payment, 'p2wsh', transInfo)
  const spendable = transInfo.value_int
  const fees = 10000
  const totalToSend = spendable - fees
  const updateData0 = {
    bip32Derivation: [
      {
        masterFingerprint: Buffer.from('DFFED015', 'hex'),
        path: "m/48'/1'/0'/2'/0",
        pubkey: Buffer.from('0272d6aae282f3020622a07e9cc404247fde4357aac2458474c2968eef9083fa05', 'hex')
      }
    ]
  }
  const updateData1 = {
    bip32Derivation: [
      {
        masterFingerprint: Buffer.from('6C6816CE', 'hex'),
        path: "m/48'/1'/0'/2'/0",
        pubkey: Buffer.from('02cec729df6b2504c8a3e7840b4deb829203612f1a34b6ea9a377e016f9c001654', 'hex')
      }
    ]
  }
  const psbt = new bitcoin.Psbt({ network: network })
    .addInput(inputData)
    .updateInput(0, updateData1)
    .updateInput(0, updateData0)
    .addOutput({
      address: 'mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
      value: totalToSend
    })
  const psbtBaseText = psbt.toHex()
  // const psbtHex = '70736274ff010055020000000162817c67b8ba2ab3a009950353f12c5be952f87e96869b76064c59e95ca9a3660000000000ffffffff01301b0f00000000001976a914344a0f48ca150ec2b903817660b9b68b13a6702688ac000000000001012b40420f0000000000220020e031125fc2f2de93eeb26fbd12dbb46a0752866c36c934e8486e3c41d8c18176010547522102cec729df6b2504c8a3e7840b4deb829203612f1a34b6ea9a377e016f9c001654210272d6aae282f3020622a07e9cc404247fde4357aac2458474c2968eef9083fa0552ae0000'
  // addToPSBT(psbtBaseText)
  return psbtBaseText
}

async function createPayment (_type, myKeys, network) {
  network = network || regtest
  const splitType = _type.split('-').reverse()
  const isMultisig = splitType[0].slice(0, 4) === 'p2ms'
  const keys = myKeys
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
      console.log(keys[0].toString('hex'))
      console.log(keys[1].toString('hex'))
      payment = bitcoin.payments.p2ms({
        m,
        pubkeys: keys,
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
