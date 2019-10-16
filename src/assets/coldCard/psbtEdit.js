const { decodePsbt, updatePsbt } = require('psbt')

async function addToPSBT (psbtHex) {
  // const decodedPSBT = await decodePsbt({ psbt: psbtHex })
  const args = {
    psbt: psbtHex,
    bip32_derivations: [
      {
        fingerprint: 'DFFED015',
        path: "m/48'/1'/0'/2'/0",
        public_key: '02cec729df6b2504c8a3e7840b4deb829203612f1a34b6ea9a377e016f9c001654'
      },
      {
        fingerprint: '6C6816CE',
        path: "m/48'/1'/0'/2'/0",
        public_key: '0272d6aae282f3020622a07e9cc404247fde4357aac2458474c2968eef9083fa05'
      }
    ]
  }
  const addedPSBT = updatePsbt(args)
  console.log(addedPSBT.psbt === psbtHex)
  return addedPSBT.psbt
}
export { addToPSBT }
