'use strict'
const axios = require('axios')

async function updateTrans (transHex, index) {
  const response = await axios({
    method: 'post',
    url: 'https://us-central1-my-project-1506404987940.cloudfunctions.net/updateBlob',
    data: {
      newBlob: transHex
    }
  })
  return response.data
}

async function getTrans () {
  const response = await axios({
    method: 'get',
    url: 'https://us-central1-my-project-1506404987940.cloudfunctions.net/getBlob'
  })
  return response.data
}

export { updateTrans, getTrans }
