<template lang="html">
  <v-dialog v-model="loadingDialog" persistent width="300">
    <v-card color="primary" dark>
      <v-card-text>
        {{ loadingDialogText }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "LoaderDialog",
  props: {
    loadingDialog: { type: Boolean, default: false },
    loadingDialogText: { type: String, default: "" }
  },
  data: () => ({})
};
</script>
