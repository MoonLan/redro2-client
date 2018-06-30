<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-biddingmarketpanel">
    <v-tabs v-model="active"
            centered>
      <v-tab key="overview"
             ripple>概覽</v-tab>
      <v-tab-item key="overview">
        <v-card flat>
          <template v-if="$store.getters['user/isStaffOrAdmin']">
            <v-subheader>工作人員用控制項</v-subheader>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-btn @click="dialog = true"
                         outline>
                    <v-icon>photo_camera</v-icon>掃描QR CODE
                  </v-btn>
                  <v-btn @click="dialog = true"
                         outline>
                    <v-icon>import_export</v-icon>輸入ID
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider />
          </template>

          <v-card-text>
            <v-layout wrap
                      class="labeled-list">
              <v-flex xs6
                      md3>
                <span class="label">解約罰金比例</span>
                {{breakoffPaneltyRatio}}倍訂單價格
              </v-flex>
              <v-flex xs6
                      md3>
                <span class="label">解約賠償比例</span>
                {{breakoffCompensationRatio}}倍訂單價格
              </v-flex>
              <v-flex xs6
                      md3>
                <span class="label">運輸時間</span>
                {{transportationTime}}秒
              </v-flex>
            </v-layout>
          </v-card-text>

          <v-divider />
          <v-subheader>upstream</v-subheader>
          <v-list>
            <v-list-tile v-for="node in upstreams"
                         :key="node">{{node}}</v-list-tile>
          </v-list>

          <v-subheader>downstream</v-subheader>
          <v-list>
            <v-list-tile v-for="node in downstreams"
                         :key="node">{{node}}</v-list-tile>
          </v-list>
        </v-card>
      </v-tab-item>

      <template v-for="tab in tabs">
        <v-tab :key="tab.key"
               ripple>{{tab.header}}</v-tab>
        <v-tab-item :key="tab.key">
          <v-card flat>
            <v-card-text>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </template>
    </v-tabs>

    <v-fab-transition>
      <v-btn @click="dialog = true"
             fixed
             fab
             bottom
             right>
        <v-icon>photo_camera</v-icon>
      </v-btn>
    </v-fab-transition>
    <bidding-deliver-dialog v-model="dialog" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import BiddingDeliverDialog from './BiddingDeliverDialog'

export default {
  components: {
    BiddingDeliverDialog
  },
  props: {
    engineId: String,
    nodeName: String
  },
  data: () => ({
    active: null,
    tabs: [
      { header: '已釋出', key: 'released', newComing: 1 },
      { header: '已締約', key: 'signed' },
      { header: '已完成', key: 'completed' },
      { header: '已取消', key: 'canceled' },
      { header: '已解約', key: 'breakoff' }
    ],
    dialog: false
  }),
  watch: {
    nodeName(newVal) {
      this.load()
    }
  },
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapState('biddingmarket', [
      'upstreams',
      'downstreams',
      'biddings',
      'breakoffPaneltyRatio',
      'breakoffCompensationRatio',
      'transportationTime',
      'transportationStatus'
    ])
  },
  methods: {
    load() {
      this.$store.dispatch('biddingmarket/load', {
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
