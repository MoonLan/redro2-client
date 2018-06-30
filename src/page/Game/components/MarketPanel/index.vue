<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-marketreceiverpanel">
    <v-card flat>
      <v-card-text>
        <v-layout wrap
                  class="labeled-list">
          <v-flex xs6
                  md3>
            <span class="label">目前市場需求量</span>
            {{currentMarketCarNeeds}}台
          </v-flex>
          <v-flex xs6
                  md3>
            <span class="label">目前剩餘需求量</span>
            {{currentMarketCarLeftDemand}}台
          </v-flex>
          <v-flex xs6
                  md3>
            <span class="label">目前市場價格</span>
            {{currentMarketCarPrice}}元
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider />
      <template v-if="news">
        <v-subheader>新聞</v-subheader>
        <v-layout wrap>
          <v-flex xs12
                  v-for="item in news.slice().reverse()"
                  :key="item._id">
            <v-container>
              <v-card>
                <v-card-media src="https://vuetifyjs.com/static/doc-images/cards/desert.jpg"
                              height="100px">
                  <v-container fill-height
                               fluid>
                    <v-layout fill-height>
                      <v-flex xs12
                              align-end
                              flexbox>
                        <span class="headline white--text">{{item.title}}</span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
                <v-card-text>
                  <div class="grey--text">{{toReadableGameTime(item.releasedGameTime)}}發布</div>
                  <div class="grey--text">市場需求{{item.marketNeeds[0].unit}}台，每台${{item.marketNeeds[0].unitPrice}}</div>
                  {{item.content}}
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
        </v-layout>
      </template>
    </v-card>
    <v-btn @click="dialog = true"
           fab
           fixed
           bottom
           right>
      <v-icon>add</v-icon>
    </v-btn>
    <market-buy-dialog v-model="dialog" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import MarketBuyDialog from './MarketBuyDialog'

export default {
  components: { MarketBuyDialog },
  props: {
    engineId: String,
    nodeName: String
  },
  data: () => ({
    dialog: null
  }),
  watch: {
    nodeName(newVal) {
      this.load()
    }
  },
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapGetters('market', [
      'currentMarketCarPrice',
      'currentMarketCarNeeds',
      'currentMarketCarLeftDemand'
    ]),
    ...mapState('market', ['news', 'upstreams', 'needs'])
  },
  methods: {
    load() {
      this.$store.dispatch('market/load', {
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
