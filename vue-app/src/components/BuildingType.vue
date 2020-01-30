<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Building type</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-row justify="end">
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <template v-slot:activator="{ on }">
            <v-btn tile color="primary" dark class="mx-2" :disabled="readOnly" v-on="on">Add</v-btn>
          </template>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.code"
                        label="Code"
                        :rules="codeRules"
                        required
                        :disabled="isEditMode || readOnly"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                        :rules="nameRules"
                        required
                        :disabled="readOnly"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <p>Is Active:</p>
                      <v-checkbox
                        v-model="editedItem.isActive"
                        label="Dostępny"
                        :disabled="readOnly"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.description"
                        label="Description"
                        auto-grow
                        :disabled="readOnly"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn tile color="blue darken-1" text @click="close">Anuluj</v-btn>
                <v-btn tile color="blue darken-1" text :disabled="readOnly" @click="save">Zapisz</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-row>
    </v-toolbar>
    <v-divider></v-divider>

    <v-card>
      <v-card-text>
        <v-container>
          <v-row justify="space-between">
            <v-col cols="12" md="2">
              <v-text-field v-model="search.code.valueList[0]" label="Code"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field v-model="search.name.valueList[0]" label="Name"></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field v-model="search.description.valueList[0]" label="Description"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <BooleanFilterSelect v-model="search.isActive.valueList[0]" label="Is Active" />
            </v-col>
          </v-row>
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
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.code }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.description }}</td>
          <td>{{ props.item.isActive | isActive }}</td>
          <td class="justify-center">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        <v-btn tile color="primary" @click="getDictionary">Refresh</v-btn>
      </template>
    </v-data-table>
    <LoaderDialog :loading-dialog="loadingDialog" :loading-dialog-text="loadingDialogText" />
  </v-container>
</template>

<script>
import { sendAjaxWithParams } from "@/utils/ajaxPost.js";

export default {
  components: {},
  props: {
    readOnly: { type: Boolean, default: false }
  },
  data: () => ({
    dialog: false,
    items: [],
    loading: false,
    headers: [
      { text: "Code", value: "code" },
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Is Active:", value: "isActive" }
    ],
    isEditMode: false,
    search: {
      code: {
        valueList: [""],
        operator: "Contains",
        type: "TEXT",
        fieldName: "code"
      },
      name: {
        valueList: [""],
        operator: "Contains",
        type: "TEXT",
        fieldName: "name"
      },
      isActive: {
        valueList: [""],
        operator: "Equals",
        type: "BOOLEAN",
        fieldName: "isActive"
      },
      description: {
        valueList: [""],
        operator: "Contains",
        type: "TEXT",
        fieldName: "description"
      }
    },
    editedItem: {},
    total: null,
    itemsPerPageOptions: {},
    defaultItem: {},
    rowsPerPage: 5,
    pagination: null,
    valid: true,
    codeRules: [
      v => !!v || "Code is required",
      v => (v && v.length <= 30) || "Code must be shorter than 30"
    ],
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 100) || "Name must be shorter than 100"
    ],
    loadingDialog: false,
    loadingDialogText: "",
    dictionaryName: "buildingTypeDictionary"
  }),

  computed: {
    formTitle() {
      return this.isEditMode ? "New building type" : "Building type edit";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    pagination() {
      this.getDictionary();
    },
    search: {
      handler() {
        this.getDictionary();
      },
      deep: true
    }
  },

  methods: {
    editItem(item) {
      this.isEditMode = true;
      this.editedItem = JSON.parse(JSON.stringify(item));
      this.dialog = true;
    },

    close() {
      this.dialog = false;

      /* timeout jest ok, ponieważ aktualizujemy dane dopiero jak zamknie się modal */
      setTimeout(() => {
        this.editedItem = JSON.parse(JSON.stringify(this.defaultItem));
        this.isEditMode = false;
        this.$refs.form.resetValidation();
      }, 300);
    },
    async getDictionary() {
      this.loading = true;
      let params = {
        dictionaryName: this.dictionaryName,
        page: {
          size: this.pagination.itemsPerPage,
          number: this.pagination.page
        }
      };
      try {
        let result = await sendAjaxWithParams(
          this.ajaxUrls.getDictionary,
          params
        );
        if (result && result.results && result.results.items) {
          this.items = result.results.items;
        } else {
          this.items = [];
        }
        this.total = result.total;
      } catch (e) {
        console.log("error", e);
      }
      this.loading = false;
    },
    async save() {
      this.loadingDialog = true;
      this.loadingDialogText = "Updating position in progress";
      if (this.validate()) {
        if (this.isEditMode) {
          let params = {
            caseObject: this.editedItem
          };
          try {
            await sendAjaxWithParams(this.ajaxUrls.buildingTypeUpdate, params);

            this.close();
            this.getDictionary();
          } catch (e) {
            console.log("error", e);
          }
        } else {
          this.loadingDialogText = "Saving position in progress";
          let params = {
            caseObject: this.editedItem
          };
          try {
            let result = await sendAjaxWithParams(
              this.ajaxUrls.buildingTypeSave,
              params
            );
            if (result.isValid) {
              this.$store.commit("setSnackbarSuccessText", result.messageInfo);

              this.close();
              this.getDictionary();
            }
          } catch (e) {
            console.log("error", e);
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

<style></style>
