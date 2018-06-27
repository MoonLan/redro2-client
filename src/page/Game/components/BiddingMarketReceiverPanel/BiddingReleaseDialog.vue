<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            persistent
            max-width="500px"
            :value="value"
            @input="(val) => {$emit('input', val)}">
    <v-form v-model="valid"
            ref="form">
      <v-card>
        <v-card-title>
          <h3 class="headline">釋出競標</h3>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12
                    sm6
                    :pr-2="!$vuetify.breakpoint.xsOnly">
              <!-- <v-select :items="nodesNameList"
                        v-model="publisher"
                        label="釋出者"
                        autocomplete
                        required
                        :rules="requiredRule"></v-select> -->

              {{nodeName}}
            </v-flex>
            <v-flex xs12
                    sm6
                    :pl-2="!$vuetify.breakpoint.xsOnly">
              {{chain === 'upstream' ? upstream.name : downstream.name}}
              <!--
              <v-select :items="nodesNameList"
                        :disabled="!!chain"
                        v-model="market"
                        label="釋出市場"
                        required
                        :rules="requiredRule"></v-select> -->
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <h3>項目</h3>
          <v-layout wrap>
            <template v-for="(item, index) in list">
              <v-flex xs4
                      sm5
                      :key="index + '-good'">
                <v-select :items="goods"
                          v-model="item.good"
                          label="種類"
                          autocomplete
                          required
                          :rules="requiredRule"
                          hide-details></v-select>
              </v-flex>
              <v-flex xs3
                      sm3
                      :key="index + '-unit'">
                <v-text-field v-model="item.unit"
                              label="數量"
                              type="number"
                              required
                              :rules="requiredRule"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs3
                      sm3
                      :key="index + '-unitPirce'">
                <v-text-field v-model="item.unitPrice"
                              label="單價"
                              type="number"
                              required
                              :rules="requiredRule"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs2
                      sm1
                      :key="index + '-close'">
                <v-btn class="my-3"
                       icon
                       flat
                       @click="removeItem(index)">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
            </template>
          </v-layout>
          <v-btn @click="addItem('debit')"
                 block
                 outline>增加項目</v-btn>
        </v-card-text>
        <v-card-text>
          <v-layout class="labeled-list">
            <v-flex xs6>
              <span class="label">總金額</span>
              {{price}}
            </v-flex>
            <v-flex xs6>
              <span class="label">締約後時限</span>
              {{timeLimit}}秒
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
                 :disabled="!valid || loading"
                 @click="submit">登記</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
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
      loading: false,
      goods: ['Car', 'Engine', 'Body', 'Wheel'],
      hasTransportationDelay: true,
      transportationTime: 10,
      transportationCost: 100,
      publisher: '',
      market: '',
      memo: '',
      timeLimit: 300,
      list: [],
      valid: null,
      requiredRule: [v => !!v || '必需項']
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
    ])
  },
  methods: {
    submit() {
      let biddingMarketItem = {
        goods: this.list,
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
  mounted() {}
}
</script>

<style>
</style>
