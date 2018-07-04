<template>
  <v-container pa-0
               class="console">
    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp"
                         v-model="drawer"
                         fixed
                         app>
      <v-list dense>
        <template v-for="item in items">
          <v-layout v-if="item.heading"
                    :key="item.heading"
                    row
                    align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6
                    class="text-xs-center">
              <a href="#!"
                 class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children"
                        v-model="item.model"
                        :key="item.text"
                        :prepend-icon="item.model ? item.icon : item['icon-alt']"
                        append-icon="">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children"
                         :key="i"
                         @click=""
                         :to="child.to">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else
                       :key="item.text"
                       @click=""
                       :to="item.to">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp"
               color="blue darken-3"
               dark
               app
               fixed>
      <v-toolbar-title style="width: 300px"
                       class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">REDRO2</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      PING: {{$store.state.engine.latency}}MS
      <v-btn flat
             @click="$router.push('/player/login')">
        {{$store.state.user.level}}
        <v-icon class="ml-2">account_circle</v-icon>
      </v-btn>
    </v-toolbar>
    <router-view></router-view>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      { icon: 'videogame_asset', text: '所有遊戲', to: '/console/game/' },
      { icon: 'dns', text: '伺服器狀態', to: '/console/status' },
      { icon: 'history', text: '紀錄', to: '/console/status/logs' },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: '遊戲',
        model: false,
        children: [
          { text: '創建新遊戲', to: '/console/game/create' },
          { text: '進行中的遊戲', to: '/console/game/playing' },
          { text: '已結束的遊戲', to: '/console/game/ended' },
          { text: '已刪除的遊戲', to: '/console/game/deleted' }
        ]
      },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: '玩家',
        model: false,
        children: [
          { text: '所有玩家' },
          { text: '進行中的遊戲' },
          { text: '已結束的遊戲' },
          { text: '已刪除的遊戲' }
        ]
      },
      { icon: 'settings', text: '設定' },
      { icon: 'help', text: '幫助' }
    ]
  })
}
</script>

<style>
</style>
