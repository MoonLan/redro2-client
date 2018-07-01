<template>
  <v-container pa-0
               fluid
               class="game-end">
    <v-toolbar color="blue darken-3"
               dark
               app
               fixed>
      <v-toolbar-title v-if="engine"
                       class="ml-0 pl-3">
        <span>{{engine.name}} 結果</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-content v-if="engine"
               class="fill-height">

    </v-content>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import { ROOM_EVENTS, USER_LEVEL } from '@/lib/schema'

export default {
  data: () => ({
    engineId: null,
    teamIndex: null,
    role: null,

    engine: null
  }),
  computed: {},
  methods: {
    loadEngine(engineId) {
      api.engine.getInfo(engineId).then(engine => {
        this.engine = engine
        this.engineId = engineId
      })
    }
  },
  mounted() {
    this.engineId = this.$route.params.id

    this.loadEngine(this.engineId)
  }
}
</script>

<style lang="scss">
.game {
  .bg-wrapper {
    height: 20vh;
  }
}
</style>
