<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-assemblydepartmentpanel">
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
                      <v-icon>extension</v-icon>組裝
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </template>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <assembly-dialog v-model="dialog" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import AssemblyDialog from './AssemblyDialog'

export default {
  components: {
    AssemblyDialog
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
    ...mapState('assemblydepartment', ['receivers', 'bom'])
  },
  methods: {
    load() {
      this.$store.dispatch('assemblydepartment/load', {
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
