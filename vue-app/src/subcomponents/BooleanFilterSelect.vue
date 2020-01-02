<template>
  <v-select
    v-model="selectedItem"
    :items="items"
    clearable
    :label="label"
    @change="updateData()"
  ></v-select>
</template>

<script>
export default {
  name: "BooleanFilterSelect",
  props: {
    value: {
      type: Boolean,
      default: null
    },
    label: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    selectedItem: null,
    items: [
      { text: "Yes", value: "true" },
      { text: "No", value: "false" }
    ]
  }),
  watch: {
    value(val) {
      this.selectedItem = val;
    }
  },
  methods: {
    updateData() {
      this.$emit("input", this.selectedItem);
    }
  }
};
</script>
