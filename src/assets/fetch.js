'use strict'
const axios = require('axios')
exports.genAddressUnspent = async function (address) {
  const data =
  await axios(`https://testnet-api.smartbit.com.au/v1/blockchain/address/${address}/unspent`)
  const unspent = data.data.unspent
  return unspent['0']
}
