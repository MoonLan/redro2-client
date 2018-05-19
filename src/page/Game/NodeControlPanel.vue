<template>
  <v-container ma-0 pa-0 class="game-nodecontrolpanel">
    <v-tabs v-model="active">
      <template v-for="component in node.components">
        <v-tab :key="component.type" ripple>{{component.type}}</v-tab>
        <v-tab-item :key="component.type + '-item'">
          <account-panel v-if="component.type === 'Account'" :engineId="id" :nodeName="name" />
        </v-tab-item>
      </template>
    </v-tabs>
  </v-container>
</template>

<script>
import api from '@/api'
import AccountPanel from './components/AccountPanel'

export default {
  components: {
    AccountPanel
  },
  data: () => ({
    active: null
  }),
  computed: {
    node() {
      return this.$store.state.engine.nodes.find(node => node.name === this.name) || {}
    },
    id() {
      return this.$route.params.id
    },
    index() {
      return this.$route.params.index
    },
    name() {
      return this.$route.params.name
    }
  },
  methods: {},
  mounted() {}
}
</script>

<style lang="scss">
</style>
