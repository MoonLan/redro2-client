<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="500px"
            persistent
            :value="value"
            @input="(val) => {$emit('input', val)}">
    <v-card v-if="receivers">
      <v-form v-model="valid"
              @submit.prevent="submit"
              ref="form">
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
                    label="被登記者"
                    hide-details
                    required
                    :rules="[requiredRule]"></v-select>
        </v-card-text>
        <v-card-text>
          <h3>項目</h3>
          <v-layout wrap>
            <template v-for="(item, index) in list">
              <v-flex xs4
                      sm5
                      :key="index + '-good'">
                <v-autocomplete :items="goods"
                          v-model="item.good"
                          label="種類"
                          item-value="good"
                          item-text="good"
                          required
                          :rules="[requiredRule]"
                          hide-details></v-autocomplete>
              </v-flex>
              <v-flex xs6
                      sm6
                      :key="index + '-unit'">
                <v-text-field v-model="item.unit"
                              label="數量"
                              type="number"
                              required
                              :rules="[requiredRule]"
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
          <v-btn @click="addItem()"
                 block
                 outline>增加項目</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="$emit('input', false)"
                 flat>取消</v-btn>
          <v-spacer />
          <v-btn @click="clear"
                 flat>清除</v-btn>
          <v-btn type="submit"
                 :disabled="!valid"
                 flat
                 outline>登記</v-btn>
        </v-card-actions>
      </v-form>
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
      valid: null,
      receiver: null,
      list: [],
      goods: [{ good: 'Body' }, { good: 'Wheel' }, { good: 'Engine' }],
      requiredRule: v => !!v || '必需項'
    }
  },
  computed: {
    ...mapState('inventoryregister', ['nodeName', 'receivers'])
  },
  methods: {
    submit(id, operator) {
      if (!this.valid) {
        return
      }
      let ioJournalItem = {
        from: this.nodeName,
        to: this.receiver,
        list: this.list,
        gameTime: this.$store.state.engine.gameTime
      }
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('inventoryregister/regist', ioJournalItem)
        .then(() => {
          this.$emit('input', false)
          this.$store.commit('ui/OPEN_DIALOG', {
            title: '成功登記',
            text: '登記後請讓隊員確認倉儲是不是有被登記，倉儲數量將會是你剛剛登記的數量。'
          })
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          console.error(err)
          this.$store.commit('ui/STOP_LOADING')
        })
    },
    clear() {
      this.$refs.form.reset()
    },
    addItem() {
      this.list.push({
        good: '',
        unit: 0
      })
    },
    removeItem(index) {
      this.list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
</style>
