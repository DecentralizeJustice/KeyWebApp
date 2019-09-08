<template>
  <v-container grid-list-md text-center fill-height text-xs-center>
    <v-layout row wrap align-center>
      <v-flex xs12>
        <v-card
          max-width="344"
          class="mx-auto"
        >
          <v-card-title class="justify-center">No Pending Transactions</v-card-title>
          <v-card-actions class="justify-center">
            <v-btn v-on:click="run()">Check</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { stuff } from '@/assets/psbt.js'
import { genAddress } from '@/assets/genAddress.js'
export default {
  components: {

  },
  methods: {
    async run (stepUpdate) {
      // console.log(genAddress(1))
      const test = await stuff(1)
      console.log(test)
    }
  }
}
</script>
