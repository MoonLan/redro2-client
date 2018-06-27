<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12>
        <h1>REDRO2</h1>
        <h2>2018 清大工程領袖營 課程股發行</h2>
      </v-flex>
      <v-flex>
        <v-btn @click="$router.push('/player')"
               outline>進入遊戲</v-btn>
        <v-btn @click="$router.push('/player/login')"
               outline>登入</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {}
</script>

<style>
</style>
