<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-nodecontrolpanel">
    <v-tabs v-model="active"
            centered
            show-arrows>
      <template v-if="components"
                v-for="component in components">
        <v-tab :key="component.type"
               ripple>{{$t(`${component.type}.title`)}}</v-tab>
        <v-tab-item :key="component.type + '-item'">
          <account-panel v-if="component.type === 'Account'"
                         :engineId="id"
                         :nodeName="name" />
          <inventory-panel v-else-if="component.type === 'Inventory'"
                           :engineId="id"
                           :nodeName="name" />
          <IOPanel v-else-if="component.type === 'IO'"
                   :engineId="id"
                   :nodeName="name" />
          <BiddingMarketPanel v-else-if="component.type === 'BiddingMarket'"
                              :engineId="id"
                              :nodeName="name" />
          <BiddingMarketReceiverPanel v-else-if="component.type === 'BiddingMarketReceiver'"
                                      :engineId="id"
                                      :nodeName="name" />
          <AssemblyDepartmentPanel v-else-if="component.type === 'AssemblyDepartment'"
                                   :engineId="id"
                                   :nodeName="name" />
          <MarketPanel v-else-if="component.type === 'Market'"
                       :engineId="id"
                       :nodeName="name" />
          <MarketReceiverPanel v-else-if="component.type === 'MarketReceiver'"
                               :engineId="id"
                               :nodeName="name" />
        </v-tab-item>
      </template>
    </v-tabs>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import AccountPanel from './components/AccountPanel'
import InventoryPanel from './components/InventoryPanel'
import IOPanel from './components/IOPanel'
import BiddingMarketPanel from './components/BiddingMarketPanel'
import BiddingMarketReceiverPanel from './components/BiddingMarketReceiverPanel'
import AssemblyDepartmentPanel from './components/AssemblyDepartmentPanel'
import MarketPanel from './components/MarketPanel'
import MarketReceiverPanel from './components/MarketReceiverPanel'

export default {
  components: {
    AccountPanel,
    InventoryPanel,
    IOPanel,
    BiddingMarketPanel,
    BiddingMarketReceiverPanel,
    AssemblyDepartmentPanel,
    MarketPanel,
    MarketReceiverPanel
  },
  data: () => ({
    active: '0'
  }),
  computed: {
    ...mapState('engine', ['stage', 'nodes']),
    ...mapGetters('engine', [
      'gameTimeAdd',
      'toReadableGameTime',
      'readableGameTime'
    ]),
    node() {
      if (!this.nodes) {
        return
      }
      return this.nodes.find(node => node.name === this.name)
    },
    id() {
      return this.$route.params.id
    },
    index() {
      return this.$route.params.teamIndex
    },
    name() {
      return this.$route.params.role
    },
    components() {
      if (!this.node) {
        return
      }
      return this.node.components.filter(component => component.enable === true)
    }
  },
  methods: {},
  mounted() {}
}
</script>

<style lang="scss">
</style>
