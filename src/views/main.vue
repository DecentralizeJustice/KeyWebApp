<template>
  <v-container grid-list-md text-center fill-height text-xs-center>
    <v-layout row wrap align-center>
      <v-flex xs12>
        <v-card
          max-width="344"
          class="mx-auto"
        >
          <v-card-actions class="justify-center">
            <v-btn v-on:click="run">Check for State</v-btn>
            <v-btn v-on:click="incrementCounter">Update State</v-btn>
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
// import { stuff } from '@/assets/psbt.js'
// import { genAddress } from '@/assets/genAddress.js'
export default {
  components: {

  },
  methods: {
    async run (stepUpdate) {
      // console.log(genAddress(1))
      const test = await this.$store.state.count
      console.log(test)
    },
    incrementCounter () {
      this.$store.dispatch('inrementAction', 1)
    }
  }
}
</script>
