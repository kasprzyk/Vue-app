<template>
  <v-autocomplete
    v-model="selectData"
    :solo="solo !== false"
    :dense="dense !== false"
    :items="dictionary"
    :label="label"
    :rules="rules"
    :multiple="multiple"
    :item-text="itemText ? itemText : 'name'"
    :item-value="itemValueComputed"
    placeholder
    :disabled="disabled"
    clearable
    :return-object="true"
    @change="updateData()"
  ></v-autocomplete>
</template>

<script>
export default {
  name: "SimpleDictionarySelect",
  props: {
    value: {
      type: [Array, Object, String],
      default: null
    },
    dictionaryName: {
      type: String,
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
    multiple: {
      type: Boolean,
      default: false
    },
    returnObject: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    itemText: {
      type: String,
      default: null
    },
    itemValue: {
      type: String,
      default: null
    },
    solo: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    excludedCodes: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    selectData: null,
    dictionary: [],
    itemValueComputed: ""
  }),
  watch: {
    value: {
      async handler() {
        var tmpDictionary = await this.getSimpleDictionary(this.dictionaryName);
        if (this.returnObject !== false && this.value) {
          if (this.multiple) {
            this.selectData = tmpDictionary.filter(item =>
              this.value.some(
                element =>
                  element[this.itemValueComputed] ==
                  item[this.itemValueComputed]
              )
            );
          } else {
            this.selectData = tmpDictionary.find(
              item =>
                item[this.itemValueComputed] ==
                this.value[this.itemValueComputed]
            );
          }
          this.updateData();
        } else {
          if (this.multiple) {
            this.selectData = this.value
              ? tmpDictionary.filter(item =>
                  this.value.includes(item[this.itemValueComputed])
                )
              : [];
          } else {
            this.selectData = tmpDictionary.find(
              item => item[this.itemValueComputed] == this.value
            );
          }
        }
      },
      deep: true
    },
    async excludedCodes() {
      var dictionary = await this.getSimpleDictionary(this.dictionaryName);
      if (this.excludedCodes && this.excludedCodes.length) {
        dictionary = dictionary.filter(
          el => !this.excludedCodes.includes(el.code)
        );
      }
      this.dictionary = dictionary;
    }
  },
  async mounted() {
    this.itemValueComputed = this.itemValue ? this.itemValue : "code";
    if (this.value) {
      this.selectData = this.value;
      let tmpDictionary = await this.getSimpleDictionary(this.dictionaryName);
      if (this.returnObject !== false && this.value) {
        if (this.multiple) {
          this.selectData = tmpDictionary.filter(item =>
            this.value.some(
              element =>
                element[this.itemValueComputed] == item[this.itemValueComputed]
            )
          );
        } else {
          this.selectData = tmpDictionary.find(
            item =>
              item[this.itemValueComputed] == this.value[this.itemValueComputed]
          );
        }
        this.updateData();
      }
    }
  },
  async created() {
    var dictionary = await this.getSimpleDictionary(this.dictionaryName);
    if (this.excludedCodes && this.excludedCodes.length) {
      dictionary = dictionary.filter(
        el => !this.excludedCodes.includes(el.code)
      );
    }
    this.dictionary = dictionary;
  },
  methods: {
    updateData() {
      var returnObject;
      if (this.returnObject === false && this.selectData) {
        returnObject = this.multiple
          ? this.selectData.map(item => item[this.itemValueComputed])
          : this.selectData[this.itemValueComputed];
      } else {
        returnObject = this.selectData;
      }
      if (JSON.stringify(this.value) !== JSON.stringify(this.selectData)) {
        this.$emit("input", returnObject);
      }
    }
  }
};
</script>
