const bip32 = require('bip32')
const bip39 = require('bip39')
// const bitcoin = require('bitcoinjs-lib')
const bs58check = require('bs58check')
const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
const divPath = "m/48'/1'/0'/1'"
async function getToNode () {
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const node = await bip32.fromSeed(seed)
  const child = await node.derivePath(divPath)
  return child
}
async function genpub () {
  const child = await getToNode()
  return child.neutered().toBase58()
}
async function genxprv () {
  const child = await getToNode()
  return child.toBase58()
}
async function testXFP () {
  const xpub = pubToXpub('tpubD94LpDG9ma54yvb1X4ncTuW3KVvELaEQzeEjn5FxEynykv4CrUk4m8BKM21WE7SaAnWzEYQztqiRu4PEJBGeG3ZPo4mX8s9FTP9GZ3q6y5G')
  const decoded = bs58check.decode(xpub)
  const stuff = decoded.toString('hex').substring(10, 10 + 8)
  return stuff
}
function pubToXpub (pub) {
  var data = bs58check.decode(pub)
  data = data.slice(4)
  data = Buffer.concat([Buffer.from('0488b21e', 'hex'), data])
  return bs58check.encode(data)
}

export { genpub, genxprv, testXFP }
