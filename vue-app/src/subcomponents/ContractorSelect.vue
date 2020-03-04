<template>
  <div class="contractorSelect">
    <v-autocomplete
      v-model="selectData"
      :items="contractors"
      :loading="loading"
      :search-input.sync="filter"
      hide-selected
      hide-no-data
      item-text="name"
      item-value="gid"
      :label="label"
      :return-object="returnObject"
      clearable
      :disabled="disabled"
      no-filter
      :multiple="multiple"
      :rules="rules"
      @change="updateData()"
      @focus="focus()"
    >
      <template v-slot:selection="data">
        <v-chip
          small
          :input-value="data.selected"
          close
          class="chip--select-multi"
          @click:close="removeItem(data.item)"
        >
          <strong>{{ data.item | showContractorFormatted("name") }}</strong>
          &nbsp;({{ data.item.nip }})
        </v-chip>
      </template>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title v-text="data.item.name"></v-list-item-title>
          <v-list-item-subtitle>
            <b>NIP:</b>
            {{ data.item.nip }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
      <template v-slot:append-outer>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn tile text small fab v-on="on">
              <v-icon>more_vert</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-text>
              <b>Filter</b>
              <br />
              <br />
              <v-select
                v-model="filterBy"
                :disabled="disabled"
                :items="filterOption"
                item-text="name"
                item-value="value"
                label="Filtr"
              ></v-select>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  name: "ContractorSelect",
  components: {},
  props: {
    value: {
      type: [Array, Object, String],
      default: null
    },
    groupeNameList: {
      type: Array,
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
    defaultGroup: {
      type: String,
      default: null
    }
  },
  data: () => ({
    selectData: null,
    loading: false,
    contractors: [],
    filter: null,
    filterBy: "name",
    text: "",
    filterOption: [
      {
        name: "Name",
        value: "name"
      },
      {
        name: "NIP",
        value: "nip"
      }
    ],
    selectedGroup: null,
    newContractor: {
      address: {
        country: "PL"
      },
      groups: {},
      status: "0"
    },
    defaultContractor: {
      address: {
        country: "PL"
      },
      groups: {},
      status: "0"
    },

    menu: false
  }),
  watch: {
    value: {
      handler() {
        this.selectData = this.value;
        this.extendContractorList();
      },
      deep: true
    },
    filter() {
      if (this.filter != null) {
        this.search(this.filter, this.filterBy);
      }
    }
  },
  mounted() {
    if (this.value) {
      this.selectData = this.value;
      this.extendContractorList();
    }
    if (
      this.defaultGroup &&
      this.groupeNameList &&
      this.groupeNameList.length > 0
    ) {
      this.selectedGroup = this.defaultGroup;
    }
  },

  methods: {
    async contractorGet(groupNameList, text, filter) {
      try {
        var data = await this.sendAjaxWithParams(
          this.ajaxUrls.basiContractorGet,
          {
            groupNameList,
            text,
            filter,
            page: 1,
            pageSize: 100 // narazie daje na sztywno
          }
        );

        return data.result.items;
      } catch (e) {
        console.error("Error", e);
        return [];
      }
    },
    updateData() {
      this.$emit("input", this.selectData);
    },
    async focus() {
      await this.search();
    },
    async search(text, filterBy) {
      this.loading = true;
      var groupNameList;
      if (this.selectedGroup) {
        groupNameList = Array.isArray(this.selectedGroup)
          ? [...this.selectedGroup]
          : [this.selectedGroup];
      } else {
        groupNameList = this.groupeNameList;
      }
      // var groupNameList = this.selectedGroup ? [...this.selectedGroup] : this.groupeNameList;
      this.contractors = await this.contractorGet(
        groupNameList,
        text,
        filterBy
      );
      this.extendContractorList();
      this.loading = false;
    },
    extendContractorList() {
      if (this.returnObject != null && this.selectData) {
        if (Array.isArray(this.selectData)) {
          this.contractors.push(...this.selectData);
        } else {
          this.contractors.push(this.selectData);
        }
      }
    },
    removeItem(val) {
      var _this = this;
      if (this.multiple) {
        const index = this.selectData.findIndex(item => {
          if (_this.returnObject) {
            return item.gid == val.gid;
          }
          return item == val.gid;
        });
        if (index >= 0) this.selectData.splice(index, 1);
      } else {
        this.selectData = null;
      }
    }
  }
};
</script>

<style>
.basicContractorSelect .v-input__append-outer {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
.basicContractorSelect .v-input__append-outer button {
  margin: 0 !important;
}
</style>
