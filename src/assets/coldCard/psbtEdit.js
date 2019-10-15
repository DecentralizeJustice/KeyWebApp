const { decodePsbt } = require('psbt')

async function decodePsbtHex (psbtHex) {
  const results = await decodePsbt({ psbt: psbtHex })
  return results
}
export { decodePsbtHex }
