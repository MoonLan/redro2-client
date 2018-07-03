<template>
  <v-app :dark="$store.state.ui.dark">
    <router-view />

    <v-dialog v-model="$store.state.ui.loading"
              max-width="250px"
              persistent>
      <v-card>
        <v-card-text>
          <v-layout>
            <v-flex xs3
                    class="loading-icon">
              <v-progress-circular indeterminate
                                   color="primary"
                                   :size="50"></v-progress-circular>
            </v-flex>
            <v-flex xs9
                    class="loading-text"
                    v-text="$t('common.nowLoading')"></v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="$store.state.ui.dialog"
              max-width="350px"
              persistent>
      <v-card>
        <v-card-title class="headline">{{ $t($store.state.ui.dialogTitle) }}</v-card-title>
        <v-card-text>
          <div v-html="$t($store.state.ui.dialogText)"></div>
          <div v-html="$store.state.ui.dialogMore"></div>
        </v-card-text>
        <v-card-actions v-if="$store.state.ui.dialogMode === 'info'">
          <v-spacer />
          <v-btn @click="$store.commit('ui/CLOSE_DIALOG')"
                 flat
                 v-text="$t('dialog.OK')"></v-btn>
        </v-card-actions>
        <v-card-actions v-if="$store.state.ui.dialogMode === 'request'">
          <v-spacer />
          <v-btn @click="$bus.$emit('dialog-return', 'No'), $store.commit('ui/CLOSE_DIALOG')"
                 flat
                 v-text="$t('dialog.No')"></v-btn>
          <v-btn @click="$bus.$emit('dialog-return', 'Yes'), $store.commit('ui/CLOSE_DIALOG')"
                 flat
                 v-text="$t('dialog.Yes')"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar :timeout="6000"
                bottom
                :value="$store.state.ui.snackbar">
      {{ $store.state.ui.snackbarText }}
      <v-btn flat
             dark
             @click.native="$store.commit('ui/CLOSE_SNACKBAR')">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {}
</script>

<style lang="scss">
.application {
  :not(i) {
    font-family: 'Roboto', '微軟正黑體', 'Arial MS Unicode', 'Helvetica Neue',
      sans-serif, Arial, Helvetica, sans-serif;
  }
  input:-webkit-autofill {
    background-color: unset !important;
  }

  .loading-icon {
    margin-top: 6px;
  }
  .loading-text {
    padding-top: 20px;
    padding-left: 10px;
  }
  .labeled-list {
    .flex {
      padding-bottom: 5px;
    }
    font-size: 14px;

    .label {
      display: block;
      font-size: 10px;
      color: #888;
    }
  }
}
</style>
