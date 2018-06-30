<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-inventoryregister">
    <v-tabs v-model="active"
            centered>
      <v-tab key="overview"
             ripple>概覽</v-tab>
      <v-tab-item key="overview">
        <v-card flat>
          <v-card-text>
            <v-subheader>receivers</v-subheader>
            <v-list>
              <v-list-tile v-for="node in receivers"
                           :key="node">{{node}}</v-list-tile>
            </v-list>

            <template v-if="$store.getters['user/isStaffOrAdmin']">
              <v-divider />
              <v-subheader>工作人員用控制項</v-subheader>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-btn @click="dialog = true"
                           outline>
                      <v-icon>add</v-icon>登記
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </template>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <v-fab-transition>
      <v-btn @click="dialog = true"
             fixed
             fab
             bottom
             right>
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <inventory-regist-dialog v-model="dialog" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import InventoryRegistDialog from './InventoryRegistDialog'

export default {
  components: {
    InventoryRegistDialog
  },
  props: {
    engineId: String,
    nodeName: String
  },
  data: () => ({
    active: null,
    dialog: false
  }),
  watch: {
    nodeName(newVal) {
      this.load()
    }
  },
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapState('inventoryregister', ['receivers'])
  },
  methods: {
    load() {
      this.$store.dispatch('inventoryregister/load', {
        engineId: this.engineId,
        nodeName: this.nodeName
      })
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style lang="scss">
</style>
