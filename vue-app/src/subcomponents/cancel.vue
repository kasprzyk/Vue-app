<template>
  <v-dialog v-model="confirmDialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">Do You want to cancel?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn tile color="green darken-1" text @click="failureCancellation()">No</v-btn>
        <v-btn tile color="green darken-1" text @click="confirmCancellation()">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AgreementCancel",
  props: {
    currentItem: {
      type: Object,
      default: null
    },
    dictionaryNameStatus: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      confirmDialog: false
    };
  },
  methods: {
    // @public
    open() {
      this.confirmDialog = true;
    },
    async confirmCancellation() {
      const params = {
        caseObject: this.currentItem,
        dictionaryName: this.dictionaryNameStatus
      };
      try {
        const result = await this.sendAjaxWithParams(
          this.ajaxUrls.cancel,
          params
        );
        this.$emit("confirmCancellation", result.messageInfo);
      } catch (e) {
        this.$emit("error", e);
      }
      this.confirmDialog = false;
    },
    failureCancellation() {
      this.confirmDialog = false;
    }
  }
};
</script>
