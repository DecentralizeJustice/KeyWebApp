<template>
  <v-container grid-list-md text-center fill-height text-xs-center>
    <v-layout row wrap align-center>
      <v-flex xs12>
        <v-card
          class="mx-auto"
        >
          <v-card-actions class="justify-center">
            <v-btn v-on:click="getTransB">Get PBST</v-btn>
            <!-- <v-btn v-on:click="getAddress">Get Address</v-btn>-->
            <v-btn v-on:click="signTrans">Sign PBST</v-btn>
            <v-btn v-on:click="updateTransB">Update PBST</v-btn>
          </v-card-actions>
          <v-btn class="ma-2" color="orange" dark> Extra
        <v-icon dark right>mdi-xbox-controller-menu</v-icon>
      </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { getTrans, updateTrans } from '@/assets/util/networkUtil.js'
import { signPSBT } from '@/assets/util/psbtUtil.js'

export default {
  data: () => ({
    unsignedTransHex: '',
    signedTransHex: ''
  }),
  components: {
  },
  methods: {
    async getTransB () {
      const serverInfo = await getTrans()
      this.unsignedTransHex = serverInfo.blob.trans
      console.log(this.unsignedTransHex)
    },
    async updateTransB () {
      console.log(this.signedTransHex)
      const results = await updateTrans(this.signedTransHex)
      console.log(results)
    },
    // async getAddress () {
    //   const test = await genAddress(0)
    //   console.log(test)
    // },
    async signTrans () {
      const trans = await getTrans()
      const unsigned = trans.blob.trans
      const signedTrans = await signPSBT(unsigned)
      this.signedTransHex = signedTrans
      console.log(this.signedTransHex)
    }
  }
}
</script>
