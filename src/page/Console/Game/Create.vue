<template>
  <v-content class="console-game-create">
    <v-container>
      <v-layout wrap>
        <v-flex xs12>
          <v-form v-model="valid"
                  @submit.prevent="submit"
                  ref="form">
            <v-card>
              <v-card-title primary-title>
                <v-btn icon
                       @click="$router.go(-1)">
                  <v-icon>arrow_back</v-icon>
                </v-btn>
                <h3 class="headline mb-0">創建新遊戲</h3>
              </v-card-title>
              <v-subheader>引擎</v-subheader>
              <v-card-text>
                <v-text-field v-model="name"
                              label="Name"
                              required
                              :rules="requiredRule"></v-text-field>
                <v-text-field v-model="describe"
                              label="Describe"></v-text-field>
                <v-text-field v-model="gameDays"
                              label="GameDays"
                              type="number"
                              suffix="天"
                              required
                              :rules="requiredRule"></v-text-field>
                <v-text-field v-model="dayLength"
                              label="DayLength"
                              suffix="秒"
                              type="number"
                              required
                              :rules="requiredRule"></v-text-field>
              </v-card-text>

              <v-subheader>節點</v-subheader>
              <v-card-text>
                <v-text-field v-model="teamIndex"
                              label="組別數"
                              suffix="組"
                              required
                              :rules="requiredRule"></v-text-field>

                <v-text-field v-model="nodes"
                              label="Nodes"
                              required
                              :rules="requiredRule"
                              multi-line></v-text-field>

              </v-card-text>

              <v-subheader>零件廠</v-subheader>
              <v-card-text>
                <v-text-field v-model="teamIndex"
                              label="初始金額"
                              suffix="元"
                              required
                              :rules="requiredRule"></v-text-field>
                <v-text-field v-model="teamIndex"
                              label="初始金額"
                              suffix="元"
                              required
                              :rules="requiredRule"></v-text-field>

                <v-text-field v-model="nodes"
                              label="Nodes"
                              required
                              :rules="requiredRule"
                              multi-line></v-text-field>

              </v-card-text>

              <v-subheader>權限</v-subheader>
              <v-card-text>
                <v-text-field v-model="permissions"
                              label="Permissions"
                              required
                              :rules="requiredRule"
                              multi-line></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="clear"
                       flat>清除</v-btn>
                <v-btn type="submit"
                       :disabled="!valid"
                       flat>創建</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import api from '@/api'
import { PERMISSIONS, NODES } from './engine.config'

export default {
  data: () => ({
    valid: null,
    name: 'UnknownEngineName',
    describe: 'Just a Game!',
    gameDays: 3,
    dayLength: 300,
    nodes: '',
    teamIndex: '',

    componentsFactory: {
      Account: {
        enable: true,
        initialCash: 150000
      },
      Inventory: {
        enable: true,
        hasStorageCost: true,
        storageCost: [
          {
            good: 'Engine',
            costPerBatch: 5
          },
          {
            good: 'Body',
            costPerBatch: 10
          },
          {
            good: 'Wheel',
            costPerBatch: 6
          }
        ],
        batchSize: 10,
        mode: 'PERIODIC'
      },
      IO: {
        enable: true,
        transportationTime: 5,
        transportationCost: 100,
        batchSize: 4,
        availableImportGoods: [
          { good: 'Wheel' },
          { good: 'Body' },
          { good: 'Engine' }
        ],
        availableExportGoods: [
          { good: 'Wheel' },
          { good: 'Body' },
          { good: 'Engine' }
        ]
      },
      BiddingMarketReceiver: {
        enable: true,
        downstreamProvider: 'ComponentsBiddingMarket'
      }
    },

    assemblyFactory: {
      Account: {
        enable: true,
        initialCash: 100000
      },
      Inventory: {
        enable: true,
        hasStorageCost: true,
        storageCost: [
          {
            good: 'Engine',
            costPerBatch: 5
          },
          {
            good: 'Body',
            costPerBatch: 10
          },
          {
            good: 'Wheel',
            costPerBatch: 6
          },
          {
            good: 'Car',
            costPerBatch: 6
          }
        ],
        batchSize: 10
      },
      IO: {
        enable: true,
        transportationTime: 5,
        transportationCost: 100,
        batchSize: 4,
        availableImportGoods: [
          { good: 'Wheel' },
          { good: 'Body' },
          { good: 'Engine' }
        ],
        availableExportGoods: [{ good: 'Car' }]
      },
      BiddingMarketReceiver: {
        enable: true,
        upstreamProvider: 'ComponentsBiddingMarket',
        downstreamProvider: 'CarsBiddingMarket'
      }
    },
    retailer: {
      Account: {
        enable: true,
        initialCash: 50000
      },
      Inventory: {
        enable: true,
        hasStorageCost: true,
        storageCost: [
          {
            good: 'Car',
            costPerBatch: 6
          }
        ],
        batchSize: 10
      },
      IO: {
        enable: true,
        transportationTime: 5,
        transportationCost: 100,
        batchSize: 4,
        availableImportGoods: [{ good: 'Car' }],
        availableExportGoods: [{ good: 'Car' }]
      },
      BiddingMarketReceiver: {
        enable: true,
        upstreamProvider: 'CarsBiddingMarket'
      },
      MarketReceiver: {
        enable: true,
        provider: 'Market'
      }
    },

    permissions: '',
    requiredRule: [v => !!v || '必需項']
  }),
  methods: {
    submit() {
      if (!this.valid) {
        return
      }
      this.$store.commit('ui/START_LOADING')
      api.server
        .createGame({
          name: this.name,
          describe: this.describe,
          gameDays: this.gameDays,
          dayLength: this.dayLength,
          nodes: JSON.parse(this.nodes),
          permissions: JSON.parse(this.permissions)
        })
        .then(engine => {
          this.$store.commit('ui/STOP_LOADING')
          this.$router.push(`/console/game/${engine.id}`)
        })
        .catch(err => {
          this.$store.commit('ui/STOP_LOADING')
          console.error(err)
        })
    },
    clear() {
      this.$refs.form.reset()
    }
  },
  mounted() {
    this.nodes = JSON.stringify(NODES, null, '  ')
    this.permissions = JSON.stringify(PERMISSIONS, null, '  ')
  }
}
</script>

<style lang="scss">
</style>
