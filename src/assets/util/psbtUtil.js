import { divPath } from '@/assets/constants/genConstants.js'
import { mnemonic } from '@/assets/constants/userConstants.js'
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

async function signPSBT (unsignedPSBT) {
  const trans = bitcoin.Psbt.fromHex(unsignedPSBT)
  const transInputs = trans.data.globalMap.unsignedTx.tx.ins
  const signedPSBT = await signTransactionInputs(trans, transInputs)
  return signedPSBT.toHex()
}

async function signTransactionInputs (trans, transInputs) {
  for (let i = 0; i < transInputs.length; i++) {
    const bip32infos = trans.data.inputs[i].bip32Derivation
    const index = bip32infos[0].path.substr(-1)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const node = await bip32.fromSeed(seed)
    const child = await node.derivePath(divPath + '/' + index.toString())
    trans = await trans.signInput(i, child)
  }
  return trans
}

export { signPSBT }
