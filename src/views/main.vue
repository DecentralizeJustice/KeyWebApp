<template>
  <v-container grid-list-md text-center fill-height text-xs-center>
    <v-layout row wrap align-center>
      <v-flex xs12>
        <v-card
          class="mx-auto"
        >
          <v-card-actions class="justify-center">
            <v-btn v-on:click="getAddress">Get Address</v-btn>
            <v-btn v-on:click="getTrans">Get PBST</v-btn>
            <v-btn>Combine PBST</v-btn>
            <v-btn>Broadcast PBST</v-btn>
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
import { getPBST } from '@/assets/coldCard/genPBST.js'
import { genAddress } from '@/assets/coldCard/genAddress.js'
export default {
  data: () => ({
  }),
  components: {
  },
  methods: {
    async getTrans () {
      const test = await getPBST()
      console.log(test)
    },
    async getAddress () {
      const test = await genAddress(0)
      console.log(test)
    }
  }
}
</script>
