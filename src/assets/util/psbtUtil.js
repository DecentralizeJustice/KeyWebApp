import { divPath } from '@/assets/constants/genConstants.js'
import { mnemonic } from '@/assets/constants/userConstants.js'
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

async function signPSBT (index, unsignedPSBT) {
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const node = await bip32.fromSeed(seed)
  const trans = bitcoin.Psbt.fromHex(unsignedPSBT)
  const child = await node.derivePath(divPath + '/' + index.toString())
  const webSigned = await trans.signAllInputs(child)
  return webSigned.toHex()
}
export { signPSBT }
