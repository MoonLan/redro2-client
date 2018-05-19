<template>
  <v-container ma-0 pa-0 class="game-nodecontrolpanel">
    <v-tabs v-model="active">
      <template v-for="component in node.components">
        <v-tab :key="component.type" ripple>{{component.type}}</v-tab>
        <v-tab-item :key="component.type + '-item'">
        </v-tab-item>
      </template>
    </v-tabs>
  </v-container>
</template>

<script>
import api from '@/api'

export default {
  props: {
    id: String,
    index: Number,
    name: String
  },
  data: () => ({
    active: null
  }),
  computed: {
    node() {
      return this.$store.state.engine.nodes.find(node => node.name === this.name) || {}
    }
  },
  methods: {},
  mounted() {}
}
</script>

<style lang="scss">
</style>
