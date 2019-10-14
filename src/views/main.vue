<template>
  <v-container grid-list-md text-center fill-height text-xs-center>
    <v-layout row wrap align-center>
      <v-flex xs12>
        <v-card
          class="mx-auto"
        >
          <v-card-actions class="justify-center">
            <v-btn v-on:click="getPub">Get Xpub</v-btn>
            <v-btn v-on:click="getxprv">Get XPriv</v-btn>
            <v-btn v-on:click="getXFP">Get XFP</v-btn>
            <v-btn v-on:click="getAddress">Get Address</v-btn>
            <v-btn v-on:click="spend">Spend Money</v-btn>
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
import { spend } from '@/assets/psbt.js'
import { genAddress } from '@/assets/genAddress.js'
import { genpub, genxprv, testXFP } from '@/assets/genUpub.js'
export default {
  data: () => ({
    neededSigs: 2
  }),
  components: {
  },
  methods: {
    async getPub () {
      const test = await genpub()
      console.log(test)
    },
    async getAddress () {
      const test = await genAddress(this.neededSigs)
      console.log(test)
    },
    async getxprv () {
      const test = await genxprv()
      console.log(test)
    },
    async getXFP () {
      const test = await testXFP()
      console.log(test)
    },
    async spend () {
      const test = await spend(this.neededSigs)
      console.log(test)
    }
  }
}
</script>
