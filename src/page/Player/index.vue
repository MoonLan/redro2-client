<template>
  <v-tabs-items v-model="active">
    <v-tab-item id="selectgame">
      <v-container class="player-selectgame fill-height">
        <v-layout wrap
                  justify-center
                  align-center>
          <v-flex xs12
                  md10
                  xl6>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">選擇遊戲場次</h3>
                </div>
              </v-card-title>
              <v-container pa-2>
                <v-card v-if="list">
                  <v-card-text v-if="list.length === 0"
                               class="text-xs-center">
                    現在沒有開放的遊戲場次
                  </v-card-text>
                  <v-list three-line>
                    <template v-for="(item, key) in list">
                      <v-list-tile :key="key"
                                   @click="loadEngine(item.id); active = 'selectrole'"
                                   ripple>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            <span class="blue--text">{{item.stage}}</span>
                            {{item.name}}
                          </v-list-tile-title>
                          <v-list-tile-sub-title>{{item.describe}}</v-list-tile-sub-title>
                          <v-list-tile-sub-title>{{item.id}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-avatar>
                          <v-icon>keyboard_arrow_right</v-icon>
                        </v-list-tile-avatar>
                      </v-list-tile>
                      <v-divider v-if="key !== list.length - 1"
                                 :key="key + '-divider'"></v-divider>
                    </template>
                  </v-list>
                </v-card>
              </v-container>
              <v-card-text class="text-xs-center">
                <router-link to="/">回首頁</router-link>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-tab-item>

    <v-tab-item id="selectrole">
      <v-container class="player-selectrole fill-height">
        <v-layout wrap
                  justify-center
                  align-center>
          <v-flex xs12
                  md10
                  xl6>
            <v-card v-if="engine"
                    class="elevation-0 transparent">
              <v-card-title primary-title>
                <v-btn @click="active = 'selectgame'"
                       icon
                       flat>
                  <v-icon>arrow_back</v-icon>
                </v-btn>
                <div>
                  <h3 class="headline mb-0">選擇你的角色</h3>
                </div>
              </v-card-title>
              <v-card-text>
                <div>你選擇了 {{engine.name}}</div>
                <div>目前階段 {{engine.stage}}</div>
              </v-card-text>
              <v-layout wrap>
                <v-flex xs12
                        md4
                        v-for="item in roles"
                        :key="item.name">
                  <v-container pa-2>
                    <v-card>
                      <v-card-title class="pb-0">
                        <span class="headline">{{item.name}}</span>
                      </v-card-title>
                      <v-card-text>{{item.description}}</v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn v-if="!item.to"
                               @click="active = 'selectteam'; role = item.role"
                               flat
                               outline>成為{{item.name}}</v-btn>
                        <v-btn v-else
                               :to="item.to"
                               flat
                               outline>成為{{item.name}}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-tab-item>

    <v-tab-item id="selectteam">
      <v-container class="player-selectteam fill-height">
        <v-layout wrap
                  justify-center
                  align-center>
          <v-flex xs12
                  md10
                  xl6>
            <v-card v-if="engine && teams"
                    class="elevation-0 transparent">
              <v-card-title primary-title>
                <v-btn @click="active = 'selectrole'"
                       icon
                       flat>
                  <v-icon>arrow_back</v-icon>
                </v-btn>
                <div>
                  <h3 class="headline mb-0">選擇你的小隊</h3>
                </div>
              </v-card-title>
              <v-container pa-2>
                <v-card>
                  <v-list>
                    <template v-for="(team, key) in teams">
                      <v-list-tile :key="team.index"
                                   @click="teamIndex = team.index; active = 'selectjob'"
                                   ripple>
                        <v-list-tile-title>
                          <span class="blue--text">#{{team.index}}</span>
                          {{team.name}}
                        </v-list-tile-title>
                        <v-list-tile-avatar>
                          <v-icon>keyboard_arrow_right</v-icon>
                        </v-list-tile-avatar>
                      </v-list-tile>
                      <v-divider v-if="key !== teams.length - 1"
                                 :key="key + '-divider'"></v-divider>
                    </template>
                  </v-list>
                </v-card>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-tab-item>

    <v-tab-item id="selectjob">
      <v-container class="player-selectjob fill-height">
        <v-layout wrap
                  justify-center
                  align-center>
          <v-flex xs12
                  md10
                  xl6>
            <v-card v-if="jobs"
                    class="elevation-0 transparent">
              <v-card-title primary-title>
                <v-btn @click="active = 'selectteam'"
                       icon
                       flat>
                  <v-icon>arrow_back</v-icon>
                </v-btn>
                <div>
                  <h3 class="headline mb-0">選擇你的工作</h3>
                </div>
              </v-card-title>
              <v-card-text>
                你現在是{{role}}的第{{teamIndex}}組。
              </v-card-text>
              <v-container pa-2>
                <v-card>
                  <v-list>
                    <template v-for="(item, key) in jobs">
                      <v-list-tile :key="key"
                                   :to="`/player/ready/${engineId}/${teamIndex}/${item.role}${teamIndex !== 0 ? '-' + teamIndex : ''}`"
                                   ripple>
                        <v-list-tile-title>
                          {{$t('role.' + item.name)}}
                        </v-list-tile-title>
                        <v-list-tile-avatar>
                          <v-icon>keyboard_arrow_right</v-icon>
                        </v-list-tile-avatar>
                      </v-list-tile>
                      <v-divider v-if="key !== jobs.length - 1"
                                 :key="key + '-divider'"></v-divider>
                    </template>
                  </v-list>
                </v-card>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-tab-item>
  </v-tabs-items>
</template>

<script>
import api from '@/api'

export default {
  data: () => ({
    active: 'selectgame',
    list: null,
    engineId: null,
    role: null,
    teamIndex: null,
    job: null,
    roles: [
      {
        role: 'player',
        name: '玩家',
        description: '成為玩家，再來會選擇你的組別及工作，切記，別選錯組別了！'
      },
      {
        role: 'staff',
        name: '工作人員',
        description:
          '成為工作人員，你會需要輸入帳號及密碼，還不知道帳密的請洽見者有分。'
      },
      {
        role: 'scoreboard',
        name: '記分板',
        description: '誰會想成為記分板呢？別選了。',
        to: '/scoreboard'
      }
    ],
    engine: null
  }),
  computed: {
    teams() {
      if (this.engine == null || this.role == null) {
        return
      }
      return this.role === 'player'
        ? this.engine.playerTeams
        : this.engine.staffTeams
    },
    jobs() {
      if (this.teamIndex == null || this.teams == null) {
        return
      }
      let team = this.teams.find(team => team.index === this.teamIndex)
      if (!team) {
        return
      }
      return team.roles
    }
  },
  methods: {
    loadEngine(engineId) {
      api.engine.getInfo(engineId).then(engine => {
        this.engine = engine
        this.engineId = engineId
      })
    }
  },
  mounted() {
    api.server.getEnginesList().then(list => {
      this.list = list
    })
  }
}
</script>

<style lang="scss">
</style>
