<template>
  <v-app id="inspire">
    <v-row justify="center">
      <v-dialog v-model="dialog" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please wait
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: "LoadingAnimation",
  data() {
    return {
      dialog: true
    };
  }
};
</script>
