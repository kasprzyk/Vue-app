<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>Project documentation</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="2">
              <v-select
                v-model="search.caseType.valueList"
                :items="actionTypeDict"
                item-value="code"
                item-text="name"
                multiple
                label="Type"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="search.archiveNumber.valueList[0]"
                label="Archive Number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="search.name.valueList[0]"
                label="Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <BasicContractorSelect
                v-model="search.executor.valueList"
                label="Executor"
                :groupe-name-list="[]"
                multiple
                :return-object="false"
              />
            </v-col>
            <v-col cols="12" md="2">
              <PersonSelect
                v-model="search.implementerProject.valueList"
                label="Realizator"
                multiple
                :return-object="false"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-card-actions>
              More filter parameters
              <v-btn tile icon @click="show = !show">
                <v-icon>{{
                  show ? "keyboard_arrow_down" : "keyboard_arrow_up"
                }}</v-icon>
              </v-btn>
            </v-card-actions>
          </v-row>
          <v-slide-y-transition>
            <v-row v-show="show">
              <v-col cols="12" md="2">
                <PersonSelect
                  v-model="search.projectManager.valueList"
                  label="Project manager"
                  multiple
                  :return-object="false"
                />
              </v-col>
              <v-col cols="12" md="2">
                <DictionarySelect
                  v-model="search.investmentCategory.valueList"
                  dictionary-name="ZpiInvestmentCategory"
                  label="Investment Category"
                  field-name="name"
                  item-value="code"
                  item-text="name"
                  multiple
                  :url="ajaxUrls.dictionaryByFilterSearch"
                  :return-object="false"
                />
              </v-col>
              <v-col cols="12" md="2">
                <DatePickerFilter
                  v-model="search.endDate.valueList[0]"
                  label="Date from"
                />
              </v-col>
              <v-col cols="12" md="2">
                <DatePickerFilter
                  v-model="search.endDate.valueList[1]"
                  label="Date to"
                />
              </v-col>
            </v-row>
          </v-slide-y-transition>
        </v-container>
      </v-card-text>
    </v-card>

    <v-divider light></v-divider>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      :loading="loading"
      :options.sync="pagination"
      :server-items-length="total"
      :footer-props="{ itemsPerPageOptions: rowsPerPage }"
    >
      <template v-slot:item="props">
        <tr>
          <td>
            {{ props.item.header.typeCode }}
          </td>
          <td>{{ props.item.archiveNumber }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.executor }}</td>
          <td>{{ props.item.implementerProject }}</td>
          <td>{{ props.item.projectManager }}</td>
          <td>{{ props.item.investmentCategory }}</td>
          <td>{{ props.item.endDate }}</td>
          <td>{{ props.item.status }}</td>

          <td class="justify-center text-no-wrap">
            <v-icon small class="mr-2" @click="editItem(props.item)"
              >edit</v-icon
            >
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        <v-btn tile color="primary" @click="getDictionary">Odśwież</v-btn>
      </template>
    </v-data-table>

    <BuildingProject
      v-if="BuildingProjectInitialized"
      ref="BuildingProject"
      :edited-item="BuildingProject"
      :show-add-button="false"
      :read-only="readOnly"
      @saveComplete="saveSuccess"
      @error="errorDisplay"
    />
  </v-container>
</template>

<script>
// const  = () =>
//   import(
//     "@/components/"
//   );

export default {
  name: "ProjectDocumentation",
  components: {},

  data: () => ({
    dictionaryNameStatus: "documentation",
    actionTypeDict: [{ name: "Building Project", code: "BuildingProject" }],
    show: false,
    headers: [
      { text: "Type", value: "actionType", sortable: false },
      { text: "Archive Number	", value: "archiveNumber" },
      { text: "Name", value: "name" },
      { text: "Executor", value: "executor", sortable: false },
      { text: "Realizator", value: "implementerProject", sortable: false },
      { text: "Project Manager", value: "projectManager", sortable: false },
      {
        text: "Investment Category",
        value: "investmentCategory",
        sortable: false
      },
      { text: "End Date", value: "endDate", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    editedItem: {
      header: {}
    },
    currentItem: {},
    ZpiActionBuildingProject: {},
    search: {
      caseType: {
        valueList: [],
        operator: "Equals",
        type: "TEXT",
        fieldName: "typeTypeCodeValue"
      },
      customCaseType: {
        valueList: ["BuildingProject"],
        operator: "Equals",
        type: "TEXT",
        fieldName: "typeTypeCodeValue"
      }
    },
    BuildingProjectInitialized: false
  }),

  watch: {
    pagination() {
      this.getDictionary();
    },
    search: {
      handler() {
        if (
          this.search.caseType.valueList.length &&
          this.search.customCaseType.valueList.length > 0
        ) {
          this.search.customCaseType.valueList = [];
        } else if (
          !this.search.caseType.valueList.length &&
          !this.search.customCaseType.valueList.length
        ) {
          this.search.customCaseType.valueList = ["BuildingProject"];
        }
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.getDictionary();
        }, 100);
      },
      deep: true
    }
  },

  mounted() {
    this.rowsPerPage = this.$store.getters.getPagination;
  },

  methods: {
    saveSuccess() {
      this.getDictionary();
    },
    errorDisplay() {},
    async editItem(item) {
      this[`${item.header.typeCode}Initialized`] = true;

      while (!this.$refs[item.header.typeCode]) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 0);
        });
      }
      this.$nextTick(() => {
        this[item.header.typeCode] = JSON.parse(JSON.stringify(item));
        this.$refs[item.header.typeCode].editItem
          ? this.$refs[item.header.typeCode].editItem(
              this[item.header.typeCode]
            )
          : this.$refs[item.header.typeCode].open();
      });
    },
    openConfirmDialog(item) {
      this.currentItem = item;
      //this.$refs.cancel.open();
    }
  }
};
</script>

<style></style>
