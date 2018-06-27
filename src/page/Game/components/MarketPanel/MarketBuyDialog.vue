<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="500px"
            persistent
            :value="value"
            @input="(val) => {$emit('input', val)}">
    <v-card v-if="upstreams && needs">
      <v-card-title>
        <v-btn icon
               flat
               v-if="active === '1'"
               @click="active = '0'">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <span class="headline">組裝</span>
        <v-spacer></v-spacer>
        <v-btn icon
               flat
               @click="$emit('input', false)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select v-model="upstream"
                  :items="upstreams"
                  label="賣方"
                  hide-details></v-select>
        <v-select v-model="selectedNeeds"
                  :items="needs"
                  item-text="good"
                  label="購買產品"
                  hide-details></v-select>
        <v-text-field v-model="unit"
                      type="number"
                      label="購買數量"
                      :hint="`目前需求量為${currentMarketCarLeftDemand}台`"
                      persistent-hint></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('input', false)">取消</v-btn>
        <v-spacer />
        <v-btn @click="buy">購買</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      active: '0',
      upstream: null,
      selectedNeeds: null,
      unit: null
    }
  },
  computed: {
    ...mapState('market', ['engineId', 'nodeName', 'upstreams', 'needs']),
    ...mapGetters('market', ['currentMarketCarLeftDemand'])
  },
  methods: {
    buy(id, operator) {
      let marketJournalItem = {
        from: this.upstream,
        list: [
          {
            good: this.selectedNeeds.good,
            unit: this.unit
          }
        ]
      }
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('market/buy', marketJournalItem)
        .then(() => {
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          console.error(err)
          this.$store.commit('ui/STOP_LOADING')
        })
    }
  }
}
</script>

<style lang="scss">
</style>
