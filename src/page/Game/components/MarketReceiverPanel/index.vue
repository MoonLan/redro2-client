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
            <span class="label">本日市場需求量</span>
            {{currentMarketCarNeeds}}台
          </v-flex>
          <v-flex xs6
                  md3>
            <span class="label">本日市場單價</span>
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
                <v-card-media :src="item.banner || 'https://vuetifyjs.com/static/doc-images/cards/desert.jpg'"
                              height="100px">
                  <v-container fill-height
                               fluid>
                    <v-layout fill-height>
                      <v-flex xs12
                              align-end
                              flexbox>
                        <span class="headline white--text"
                              style="text-shadow: 0 0 5px #000;">{{item.title}}</span>
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
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  components: {},
  props: {
    engineId: String,
    nodeName: String
  },
  data: () => ({}),
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapGetters('marketreceiver', [
      'currentMarketCarPrice',
      'currentMarketCarNeeds'
    ]),
    ...mapState('marketreceiver', ['news', 'provider'])
  }
}
</script>

<style lang="scss">
</style>
