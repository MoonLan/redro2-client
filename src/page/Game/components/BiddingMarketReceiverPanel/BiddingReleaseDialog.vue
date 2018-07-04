<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            persistent
            max-width="500px"
            :value="value"
            @input="(val) => {$emit('input', val)}">
    <v-card>
      <v-form v-model="valid"
              @submit.prevent="submit"
              ref="form">
        <v-card-title>
          <h3 class="headline">釋出競標</h3>
        </v-card-title>
        <v-card-text>
          <v-layout class="labeled-list">
            <v-flex xs6>
              <span class="label">釋出者</span>
              {{nodeName}}
            </v-flex>
            <v-flex xs6>
              <span class="label">釋出市場</span>
              {{$t(`BiddingMarketReceiver.${$store.state.biddingmarketreceiver[chain].name}`)}}
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <h3>項目</h3>
          <v-layout wrap>
            <template v-for="(item, index) in list">
              <v-flex xs4
                      sm4
                      :key="index + '-good'">
                <v-text-field v-model="item.good"
                              readonly
                              label="產品"></v-text-field>
              </v-flex>
              <v-flex xs4
                      sm4
                      :key="index + '-unit'">
                <v-text-field v-model="item.unit"
                              label="數量"
                              type="number"
                              required
                              :rules="[v => (v >= 0) || `最少為0個`]"></v-text-field>
              </v-flex>
              <v-flex xs4
                      sm4
                      :key="index + '-unitPirce'">
                <v-text-field v-model="item.unitPrice"
                              label="單價"
                              :hint="`底價為${basicPrice[item.good] || 0}`"
                              persistent-hint
                              type="number"
                              :rules="[requiredRule, v => (v >= basicPrice[item.good]) || `底價為${basicPrice[item.good]}`]"
                              required></v-text-field>
              </v-flex>
            </template>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <v-layout class="labeled-list">
            <v-flex xs6>
              <span class="label">締約後時限</span>
              {{timeLimit}}秒
            </v-flex>
            <v-flex xs6>
              <span class="label">總金額</span>
              {{price}}
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn flat
                 @click="clear(), $emit('input', false)">關閉</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat
                 @click="clear">清除</v-btn>
          <v-btn flat
                 outline
                 :disabled="!valid || loading || price <= 0"
                 type="submit">登記</v-btn>
        </v-card-actions>

        <div style="flex: 1 1 auto;"></div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import api from '@/api'
import { TRANSPORTATION_STATUS } from '@/lib/schema'

export default {
  props: {
    value: Boolean,
    chain: String
  },
  data() {
    return {
      valid: null,
      loading: false,
      hasTransportationDelay: true,
      transportationTime: 10,
      transportationCost: 100,
      publisher: '',
      market: '',
      memo: '',
      timeLimit: 5,
      list: [],
      requiredRule: v => !!v || '必需項'
    }
  },
  watch: {
    goods(nv) {
      this.loadList()
    }
  },
  computed: {
    node() {
      return (
        this.$store.state.engine.nodes.find(
          node => node.name === this.nodeName
        ) || {}
      )
    },
    price() {
      let sum = 0
      for (let item of this.list) {
        if (!item.good) {
          continue
        }
        sum +=
          parseInt(item.unit ? item.unit : 0) *
          parseFloat(item.unitPrice ? item.unitPrice : 0)
      }
      return sum
    },
    nodesNameList() {
      let list = []
      for (let node of this.$store.state.engine.nodes) {
        list.push(node.name)
      }
      return list
    },
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapState('biddingmarketreceiver', [
      'upstream',
      'downstream',
      'nodeName',
      'engineId'
    ]),
    goods() {
      if (!this.nodeName) {
        return []
      }
      switch (this.nodeName.split('-')[0]) {
        case 'AssemblyFactory':
          return [
            { good: 'Body', unitPrice: 1012 },
            { good: 'Engine', unitPrice: 270 },
            { good: 'Wheel', unitPrice: 67 }
          ]
        case 'Retailer':
          return [{ good: 'Car', unitPrice: 2500 }]
      }
    },
    basicPrice() {
      if (!this.goods) {
        return {}
      }

      let set = {}
      for (let good of this.goods) {
        set[good.good] = good.unitPrice
      }
      return set
    }
  },
  methods: {
    loadList() {
      if (!this.goods) {
        return
      }
      this.list = []
      for (let good of this.goods) {
        this.list.push({
          good: good.good,
          unit: 0,
          unitPrice: good.unitPrice
        })
      }
    },
    submit() {
      if (!this.valid) {
        return
      }
      let biddingMarketItem = {
        goods: this.list.filter(item => item.unit && item.unit > 0),
        stage: 'BIDDING',
        publishedFromChain:
          this.chain === 'upstream' ? 'downstream' : 'upstream',
        publisher: this.nodeName,
        price: this.price,
        timeLimit: this.timeLimit,
        memo: this.memo,
        gameTime: this.$store.state.engine.gameTime
      }
      this.loading = true
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch(
          `biddingmarketreceiver/releaseTo${
            this.chain === 'upstream' ? 'Upstream' : 'Downstream'
          }`,
          biddingMarketItem
        )
        .then(() => {
          this.loading = false
          this.$emit('input', false)
          this.$store.commit('ui/OPEN_DIALOG', {
            title: '成功上架',
            text: ''
          })
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          this.loading = false
          this.$emit('input', false)
          this.$store.commit('ui/STOP_LOADING')
          console.error(err)
        })
    },
    clear() {
      this.$refs.form.reset()
    },
    addItem() {
      this.list.push({
        good: '',
        unit: 0,
        unitPrice: 0
      })
    },
    removeItem(index) {
      this.list.splice(index, 1)
    }
  },
  mounted() {
    this.loadList()
  }
}
</script>

<style>
</style>
