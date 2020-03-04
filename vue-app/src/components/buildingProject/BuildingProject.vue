/* eslint-disable vuetify/no-legacy-grid */
<template>
  <v-dialog v-model="dialog" fullscreen h-overlay persistent no-click-animation>
    <template v-if="showAddButton" v-slot:activator="{ on }">
      <v-btn
        tile
        color="primary"
        dark
        class="mx-2"
        :disabled="readOnly"
        v-on="on"
        >{{ addButtonLabel }}</v-btn
      >
    </template>

    <v-card>
      <v-toolbar color="primary" dark>
        <ToolbarTitle
          :object="editedItemModal"
          :is-edit-mode="isEditMode"
          object-type-name="BuildingProject"
          object-kind="action"
        ></ToolbarTitle>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn tile dark text @click="close">Cancel</v-btn>
          <v-btn tile dark text :disabled="readOnly" @click="save">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-tabs v-model="active" centered show-arrows>
          <v-tab key="0" ripple>Main data</v-tab>
          <v-tab-item key="0">
            <v-container fluid>
              <v-toolbar>
                <v-toolbar-title>Main data</v-toolbar-title>
              </v-toolbar>
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col cols="6" md="4">
                      <v-text-field
                        v-model="editedItemModal.archiveNumber"
                        label="Archive Number"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="4">
                      <v-text-field
                        v-model="editedItemModal.name"
                        :disabled="readOnly"
                        label="Project Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="4">
                      <SimpleDictionary
                        v-model="editedItemModal.variantOfDocumentation"
                        :disabled="readOnly"
                        label="Variant Of Documentation"
                        dictionary-name="VariantOfDocumentation"
                        :rules="basicRules"
                        return-object
                      ></SimpleDictionary>
                    </v-col>
                    <v-col cols="6" md="4">
                      <DatePicker
                        v-model="editedItemModal.createDate"
                        :disabled="readOnly"
                        label="Create Date"
                        :rules="basicRules"
                        :min="
                          editedItemModal.createDate
                            ? editedItemModal.createDate
                            : null
                        "
                      />
                    </v-col>

                    <v-col cols="6" md="4">
                      <DatePicker
                        v-model="editedItemModal.endDate"
                        :disabled="readOnly"
                        label="End Date"
                        :min="
                          editedItemModal.createDate
                            ? editedItemModal.createDate
                            : null
                        "
                      />
                    </v-col>
                    <v-col cols="6" md="4">
                      <SimpleDictionary
                        v-model="editedItemModal.type"
                        :disabled="readOnly"
                        label="Project Type"
                        dictionary-name="ProjectType"
                        :rules="basicRules"
                        return-object
                      ></SimpleDictionary>
                    </v-col>
                    <v-col cols="6" md="4">
                      <BasicContractorSelect
                        v-model="editedItemModal.executor"
                        :disabled="readOnly"
                        label="Executor"
                        :groupe-name-list="[]"
                        return-object
                      />
                    </v-col>
                    <v-col cols="6" md="4">
                      <PersonSelect
                        v-model="editedItemModal.implementerProject.items"
                        :disabled="readOnly"
                        label="Implementer"
                        team-name=""
                        :contractor-gid="
                          editedItemModal.executor
                            ? editedItemModal.executor.gid
                            : null
                        "
                        return-object
                        multiple
                      />
                    </v-col>
                    <v-col cols="6" md="4">
                      <PersonSelect
                        v-model="editedItemModal.coordinator"
                        :disabled="readOnly"
                        label="Coordinator"
                        team-name=""
                        :contractor-gid="
                          editedItemModal.executor
                            ? editedItemModal.executor.gid
                            : null
                        "
                        return-object
                      />
                    </v-col>
                    <v-col cols="6" md="4">
                      <PersonSelect
                        v-model="editedItemModal.projectManager"
                        :disabled="readOnly"
                        label="Project Manager"
                        team-name=""
                        return-object
                      />
                    </v-col>
                    <v-col cols="6" md="4">
                      <v-text-field
                        v-model="editedItemModal.realizationArchiveNumber"
                        :disabled="true"
                        label="Realization Archive Number"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="6" md="4">
                      <DictionarySelect
                        v-model="editedItemModal.investmentCategory"
                        :disabled="readOnly"
                        dictionary-name="ZpiInvestmentCategory"
                        label="Investment Category"
                        field-name="name"
                        item-value="code"
                        item-text="name"
                        :url="ajaxUrls.dictionaryByFilterSearch"
                        return-object
                        :rules="basicRules"
                      />
                    </v-col>
                    <v-col cols="6" md="4">
                      <SimpleDictionary
                        v-model="editedItemModal.status"
                        :disabled="readOnly"
                        label="Status"
                        dictionary-name="Status"
                        return-object
                      ></SimpleDictionary>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab v-if="isEditMode" key="2" ripple>Tasks</v-tab>
          <v-tab v-if="isEditMode" key="3" ripple>Contractors</v-tab>
          <v-tab-item v-if="isEditMode" key="3">
            <Contractors :read-only="readOnly" />
          </v-tab-item>
        </v-tabs>
      </v-form>
    </v-card>
    <LoaderDialog
      :loading-dialog="loadingDialog"
      :loading-dialog-text="loadingDialogText"
    />
  </v-dialog>
</template>

<script>
import SimpleDictionary from "@/subcomponents/SimpleDictionary.vue";
export default {
  name: "BuildingProject",
  components: {
    SimpleDictionary
  },
  props: {
    editedItem: {
      type: Object,
      default: null
    },
    showAddButton: {
      type: Boolean,
      default: false
    },
    addButtonLabel: {
      type: String,
      default: ""
    },
    objectKind: {
      type: String,
      default: ""
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    parentRealization: {
      type: Object,
      default: null
    },
    parentItem: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    editedItemModal: {
      delayReason: {}
    },
    active: 0,
    modalContext: "",
    defaultItem: {
      mrcCaseHeader: {},
      variantOfDocumentation: { code: "X01", name: "X01" },
      type: null,
      implementerProject: {},
      taskList: {}
    },
    documentTypes: [
      {
        name: "Document type 1"
      },
      {
        name: "Document type 2"
      }
    ],
    dialog: false,
    valid: true,
    basicRules: [v => !!v || "Field is required"],
    booleanRules: [v => v === true || v === false || "Field is required"],
    positiveNumberRules: [
      v => v === 0 || !v || v >= 0 || "Number has to be positive"
    ],
    isEditMode: false,
    loadingDialog: false,
    loadingDialogText: "",
    dictionaryName: "BuildingProject",
    comment: null
  }),

  watch: {
    async dialog(val) {
      if (!val) {
        this.editedItemModal = JSON.parse(JSON.stringify(this.defaultItem));
        this.close();
      } else {
        if (
          this.parentRealization &&
          (!this.editedItemModal.mrcCaseHeader ||
            !this.editedItemModal.mrcCaseHeader.caseId)
        ) {
          this.editedItemModal.planArchiveNumber = this.parentRealization.planArchiveNumber;
          this.editedItemModal.orderArchiveNumber = this.parentRealization.orderArchiveNumber;
          this.editedItemModal.realizationArchiveNumber = this.parentRealization.archiveNumber;
          this.editedItemModal.projectManager = this.parentRealization.projectManager;
        }
      }
    },
    baseRealization(val) {
      if (val) {
        this.editedItemModal.planArchiveNumber = val.planArchiveNumber;
        this.editedItemModal.orderArchiveNumber = val.orderArchiveNumber;
        this.editedItemModal.realizationArchiveNumber = val.archiveNumber;
        this.editedItemModal.investmentCategory = val.investmentCategory;
        this.editedItemModal.projectManager = val.projectManager;
      }
    },
    editedItem() {
      this.editedItemModal = JSON.parse(JSON.stringify(this.editedItem));
      if (this.editedItemModal.mrcCaseHeader?.caseId) {
        if (!this.editedItemModal.implementerProject) {
          this.editedItemModal.implementerProject = {};
        }
        if (!this.editedItemModal.taskList) {
          this.editedItemModal.taskList = {};
        }
        if (!this.editedItemModal.delayReason) {
          this.editedItemModal.delayReason = {};
        }
        this.isEditMode = true;
      } else {
        this.isEditMode = false;
      }
    }
  },
  beforeMount() {
    this.editedItemModal = JSON.parse(JSON.stringify(this.defaultItem));
  },
  mounted() {
    this.editedItemModal.variantOfDocumentation = { code: "X01", name: "X01" };
  },

  methods: {
    // @public
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.active = 0;
      this.isEditMode = false;
      this.comment = null;
      setTimeout(() => {
        this.editedItemModal = JSON.parse(JSON.stringify(this.defaultItem));
        this.$refs.form.resetValidation();
      }, 300);
    },
    async save() {
      this.loadingDialog = true;
      this.loadingDialogText = "Saving...";
      if (this.validate()) {
        if (this.isEditMode) {
          let params = {
            caseObject: this.editedItemModal,
            comment: this.comment
          };
          try {
            let result = await this.sendAjaxWithParams(
              this.ajaxUrls.actionBuildingProjectUpdate,
              params
            );
            if (result.result) {
              this.close();
              this.$emit("saveComplete", result.messageInfo);
            } else {
              this.$emit(
                "error",
                result.messageInfo ? result.messageInfo : "Error!"
              );
            }
          } catch (e) {
            this.$emit("error", e);
          }
        } else {
          this.loadingDialogText = "Loading";
          let params = {
            caseObject: this.editedItemModal
          };
          try {
            let result = await this.sendAjaxWithParams(
              this.ajaxUrls.actionBuildingProjectSave,
              params
            );
            this.close();
            this.$emit("saveComplete", result.messageInfo);
          } catch (e) {
            this.$emit("error", e);
          }
        }
      }
      this.loadingDialog = false;
    },
    validate() {
      return this.$refs.form.validate();
    }
  }
};
</script>
