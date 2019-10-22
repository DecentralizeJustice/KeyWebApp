const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
const divPath = "m/48'/1'/0'/2'"
const unsignedTrans = '70736274ff010055020000000172ac4e1d46f3878c151b2854885990b2d6d88385e30b1113fa4d6b07ed1f8c7c0100000000ffffffff01301b0f00000000001976a914344a0f48ca150ec2b903817660b9b68b13a6702688ac000000000001012b40420f0000000000220020e031125fc2f2de93eeb26fbd12dbb46a0752866c36c934e8486e3c41d8c1817601054752210272d6aae282f3020622a07e9cc404247fde4357aac2458474c2968eef9083fa052102cec729df6b2504c8a3e7840b4deb829203612f1a34b6ea9a377e016f9c00165452ae22060272d6aae282f3020622a07e9cc404247fde4357aac2458474c2968eef9083fa0518dffed0153000008001000080000000800200008000000000220602cec729df6b2504c8a3e7840b4deb829203612f1a34b6ea9a377e016f9c001654186c6816ce30000080010000800000008002000080000000000000'

async function signwithKey (index) {
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const node = await bip32.fromSeed(seed)
  const trans = bitcoin.Psbt.fromHex(unsignedTrans)
  const child = await node.derivePath(divPath + '/' + index.toString())
  const webSigned = await trans.signAllInputs(child)
  return webSigned.toHex()
}
export { signwithKey }
