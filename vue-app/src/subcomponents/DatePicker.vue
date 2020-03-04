<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
    :disabled="disabled"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateFormatted"
        :label="label"
        :rules="rules"
        prepend-icon="event"
        readonly
        :clearable="disabled != true"
        :disabled="disabled"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :min="min"
      :max="max"
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import dateOperationMixin from "@/mixins/dateOperation";

export default {
  name: "DatePicker",
  mixins: [dateOperationMixin],
  props: {
    value: {
      type: [String, Date],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    rules: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    max: {
      type: String,
      default: null
    },
    min: {
      type: String,
      default: null
    }
  },
  data: () => ({
    date: null,
    dateFormatted: null,
    menu: false
  }),
  watch: {
    date(val) {
      if (val) {
        this.$emit("input", val);
        this.dateFormatted = val;
      } else {
        this.$emit("input", null);
      }
    },
    dateFormatted(val) {
      if (!val) {
        this.date = null;
      }
    },
    value: {
      handler() {
        if (this.value) {
          this.date = this.formatDate(this.value);
          this.dateFormatted = this.date;
        } else {
          this.date = null;
          this.dateFormatted = null;
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.value) {
      this.date = this.formatDate(this.value);
      this.dateFormatted = this.date;
    } else {
      this.date = null;
      this.dateFormatted = null;
    }
  }
};
</script>
