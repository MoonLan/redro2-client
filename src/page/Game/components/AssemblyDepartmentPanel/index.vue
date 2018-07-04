<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-assemblydepartmentpanel">
    <v-card flat>
      <v-card-text>
        <template v-if="$store.getters['user/isStaffOrAdmin']">
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
          <v-divider />
        </template>

        <v-subheader>receivers</v-subheader>
        <v-list>
          <v-list-tile v-for="node in receivers"
                       :key="node">{{node}}</v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>

    <v-fab-transition>
      <v-btn @click="dialog = true"
             fixed
             fab
             bottom
             right>
        <v-icon>extension</v-icon>
      </v-btn>
    </v-fab-transition>
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
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapState('assemblydepartment', ['receivers', 'bom'])
  }
}
</script>

<style lang="scss">
</style>
