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
          <InventoryRegisterPanel v-else-if="component.type === 'InventoryRegister'"
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

export default {
  components: {
    AccountPanel: () => import('./components/AccountPanel'),
    InventoryPanel,
    IOPanel,
    BiddingMarketReceiverPanel: () =>
      import('./components/BiddingMarketReceiverPanel'),
    MarketReceiverPanel: () => import('./components/MarketReceiverPanel'),
    BiddingMarketPanel: () => import('./components/BiddingMarketPanel'),
    AssemblyDepartmentPanel: () =>
      import('./components/AssemblyDepartmentPanel'),
    MarketPanel: () => import('./components/MarketPanel'),
    InventoryRegisterPanel: () => import('./components/InventoryRegisterPanel')
  },
  data: () => ({
    active: '0',
    _id: null,
    _name: null
  }),
  computed: {
    ...mapState('engine', ['stage', 'nodes']),
    ...mapGetters('engine', [
      'gameTimeAdd',
      'toReadableGameTime',
      'readableGameTime'
    ]),
    ...mapGetters('user', ['isAdmin']),
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
      if (!this.node || !this.id || !this.name) {
        return
      }
      return this.node.components.filter(component => {
        if (component.enable === false) {
          return false
        }

        if (this.id !== this._id && this.name !== this._name) {
          let storeSet = {
            Account: 'account',
            AssemblyDepartment: 'assemblydepartment',
            BiddingMarket: 'biddingmarket',
            BiddingMarketReceiver: 'biddingmarketreceiver',
            Inventory: 'inventory',
            InventoryRegister: 'inventoryregister',
            IO: 'io',
            Market: 'market',
            MarketReceiver: 'marketreceiver'
          }
          if (component.type in storeSet) {
            this.$store.dispatch(storeSet[component.type] + '/load', {
              engineId: this.id,
              nodeName: this.name
            })
          }
          this._id = this.id
          this._name = this.name
        }

        if (component.type === 'Account' && !this.isAdmin) {
          return false
        }
        return true
      })
    }
  },
  methods: {},
  mounted() {}
}
</script>

<style lang="scss">
</style>
