'use strict'
const bitcoin = require('bitcoinjs-lib')
const wifList = require('./wif')
const NETWORKS = require('./networks')
const testnet = NETWORKS.testnet
exports.genAddress = function (m) {
  m = 2
  const network = testnet
  const eccArray = getECPairFromWifArray(wifList.wifList, network)
  let pubkeys = []
  for (let i = 0; i < eccArray.length; i++) {
    pubkeys.push(eccArray[i].publicKey)
  }
  const info = bitcoin.payments.p2sh({ network: network,
    redeem: bitcoin.payments.p2wsh({ network: network,
      redeem: bitcoin.payments.p2ms({ m: m, pubkeys: pubkeys, network: network })
    })
  })
  return info.address
}

function getECPairFromWifArray (wifArray, network) {
  let eccPairArray = []
  for (let i = 0; i < wifArray.length; i++) {
    eccPairArray.push(bitcoin.ECPair.fromWIF(wifArray[i], network))
  }
  return eccPairArray
}
