<template>
  <v-app dark>
    <toolBar app/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import toolBar from '@/components/toolBar.vue'
export default {
  name: 'App',
  data: () => ({
  }),
  components: {
    toolBar
  }
}
</script>
