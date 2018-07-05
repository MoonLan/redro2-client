<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="500px"
            persistent
            :value="value"
            @input="(val) => {$emit('input', val)}">
    <v-card v-if="receivers && bom">
      <v-card-title>
        <span class="headline">組裝</span>
        <v-spacer></v-spacer>
        <v-btn icon
               flat
               @click="$emit('input', false)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select v-model="receiver"
                  :items="receivers"
                  label="組裝者"
                  hide-details></v-select>
        <v-select v-model="selectedBom"
                  :items="bom"
                  item-text="good"
                  label="組裝產品"
                  hide-details></v-select>
        <v-text-field v-model="unit"
                      type="number"
                      label="組裝數量"
                      hide-details></v-text-field>
        <v-layout v-if="selectedBom"
                  wrap>
          <v-subheader>所需材料</v-subheader>
          <v-flex xs12
                  v-for="component in selectedBom.components"
                  :key="component.good">
            <v-layout>
              <v-flex xs6>{{component.good}}</v-flex>
              <v-flex xs3
                      text-xs-right>x{{component.unit}}</v-flex>
              <v-flex xs3
                      text-xs-right>{{component.unit * unit}}個</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-text>
        <span>請確認隊員有足夠的庫存後再按組裝！</span>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('input', false)"
               flat>取消</v-btn>
        <v-spacer />
        <v-btn @click="assemble"
               flat
               outline>組裝</v-btn>
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
      receiver: null,
      selectedBom: null,
      unit: null
    }
  },
  watch: {
    bom(newVal) {
      this.selectedBom = newVal[0]
    }
  },
  computed: {
    ...mapState('assemblydepartment', ['nodeName', 'receivers', 'bom'])
  },
  methods: {
    assemble(id, operator) {
      let ioJournalItem = {
        from: this.nodeName,
        to: this.receiver,
        list: [
          {
            good: this.selectedBom.good,
            unit: this.unit
          }
        ],
        gameTime: this.$store.state.engine.gameTime
      }
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('assemblydepartment/assemble', ioJournalItem)
        .then(() => {
          this.$emit('input', false)
          this.$store.commit('ui/OPEN_DIALOG', {
            title: '成功組裝',
            text: ''
          })
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
