<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 xl4 v-for="i in 3" :key="i">
        <v-card tile>
          <div :class="`order-media list-${i}`">
            <div :class="`order-media-item ${k === 1 ? 'car' : 'wheel'}`" v-for="k in i" :key="k">
              <div class="box">
                <span>x12</span>
              </div>
            </div>
          </div>
          <v-card-text class="px-3 py-2">
            <v-layout v-for="i in 3" :key="i">
              <v-flex xs4>引擎</v-flex>
              <v-flex xs4 class="px-1 py-1 text-xs-right">4個</v-flex>
              <v-flex xs4 class="px-1 py-1 text-xs-right">$10/個</v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions class="py-1">
            <v-menu nudge-top top>
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list two-line ripple>
                <v-list-tile @click="">
                  <v-list-tile-content>
                    <v-list-tile-title>取消訂單</v-list-tile-title>
                    <v-list-tile-sub-title>不需要手續費</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="">
                  <v-list-tile-content>
                    <v-list-tile-title>訂單解約</v-list-tile-title>
                    <v-list-tile-sub-title>需支付1.2倍訂單價格的違約金</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
            <span class="mx-0 grey--text">第二天 4:32 上架</span>
            <v-spacer />
            <v-btn flat color="primary">$120 成交</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    chain: String
  },
  data() {
    return {}
  }
}
</script>

<style>
</style>
