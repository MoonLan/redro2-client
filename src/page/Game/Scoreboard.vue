<template>
  <v-container pa-0
               fluid
               fill-height
               class="game-scoreboard">
    <v-layout>
      <v-flex v-if="['CONSTRUCTED', 'PREPARE', 'READY'].includes(stage)"
              xs12>
        <v-layout>
          <v-flex xs5>
            <v-layout row>
              <v-flex>

              </v-flex>
              <v-flex>

              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs2></v-flex>
          <v-flex xs5>
            <v-layout>
              <v-flex>
                <v-layout row>
                  <v-flex>

                  </v-flex>
                  <v-flex>

                  </v-flex>
                </v-layout>

              </v-flex>
              <v-flex>
                <v-layout row>
                  <v-flex>

                  </v-flex>
                  <v-flex>

                  </v-flex>
                </v-layout>

              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex v-if="['START', 'FINAL'].includes(stage)"
              xs12>
        <v-layout column
                  class="text-xs-center">
          <v-flex fill-height>
            <v-layout>
              <v-flex xs5
                      fill-height
                      justify-center>
                <v-container text-xs-center>
                  <v-card>
                    <v-card-text>{{readableGameTime}}</v-card-text>
                  </v-card>
                </v-container>
              </v-flex>
              <v-flex xs7
                      justify-center>
                Some Gragh
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex fill-height>
            <v-layout>
              <v-flex justify-center>1</v-flex>
              <v-flex justify-center>2</v-flex>
              <v-flex justify-center>3</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
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
  computed: {
    ...mapState('scoreboard', ['gameTime', 'stage']),
    ...mapGetters('scoreboard', ['readableGameTime'])
  },
  methods: {},
  mounted() {
    this.engineId = this.$route.params.id

    this.$store
      .dispatch('scoreboard/load', {
        engineId: this.engineId
      })
      .then(() => {
        this.$socket.emit(ROOM_EVENTS.ROOM_JOIN, {
          engineId: this.engineId,
          teamIndex: 0,
          role: 'Scoreboard'
        })
        console.log('socket:ROOM_JOIN')
      })
  },
  beforeDestroy() {
    this.$socket.emit(ROOM_EVENTS.ROOM_JOIN, {
      engineId: this.engineId,
      teamIndex: 0,
      role: 'Scoreboard'
    })
    console.log('socket:ROOM_LEAVE')
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
