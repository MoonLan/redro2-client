<template>
  <v-container ma-0 pa-0 class="game-nodecontrolpanel">
    <v-tabs v-model="active">
      <template v-for="component in components">
        <v-tab :key="component.type" ripple>{{component.type}}</v-tab>
        <v-tab-item :key="component.type + '-item'">
          <account-panel v-if="component.type === 'Account'" :engineId="id" :nodeName="name" />
          <inventory-panel v-else-if="component.type === 'Inventory'" :engineId="id" :nodeName="name" />
          <IOPanel v-else-if="component.type === 'IO'" :engineId="id" :nodeName="name" />
          <BiddingMarketReceiverPanel v-else-if="component.type === 'BiddingMarketReceiver'" :engineId="id" :nodeName="name" />
        </v-tab-item>
      </template>
    </v-tabs>
  </v-container>
</template>

<script>
import api from '@/api'
import AccountPanel from './components/AccountPanel'
import InventoryPanel from './components/InventoryPanel'
import IOPanel from './components/IOPanel'
import BiddingMarketReceiverPanel from './components/BiddingMarketReceiverPanel'

export default {
  components: {
    AccountPanel,
    InventoryPanel,
    IOPanel,
    BiddingMarketReceiverPanel
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
    },
    components() {
      return this.node.components.filter(component => component.enable === true)
    }
  },
  methods: {},
  mounted() {}
}
</script>

<style lang="scss">
</style>
