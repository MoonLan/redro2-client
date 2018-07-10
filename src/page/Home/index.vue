<template>
  <v-container fill-height
               justify-center>
    <v-card class="transparent elevation-0 text-xs-center">
      <v-card-text>
        <img src="/static/img/logo.svg"
             class="logo"
             alt="REDRO2">
      </v-card-text>
      <v-card-text>
        <h2>2018 清大工程領袖營</h2>
        <h3>REDRO2 課程股發行</h3>
      </v-card-text>
      <v-card-text>
        <v-btn @click="$router.push('/player')"
               outline>進入遊戲</v-btn>
      </v-card-text>
      <v-card-text>
        <v-btn @click="$router.push('/player/login')"
               outline>登入</v-btn>
        <v-btn @click="$store.dispatch('user/userLogout')"
               outline>登出</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {}
</script>

<style>
.logo {
  max-width: 180px;
}
</style>
