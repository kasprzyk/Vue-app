<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list dense>
        <v-list-group value="true">
          <template v-slot:activator>
            <v-list-item-title>Configuration</v-list-item-title>
          </template>
          <v-list-group
            no-action
            sub-group
            value="true"
            append-icon="dashboard"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Building type</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="(buildingTypeViews, i) in buildingTypeViews"
              :key="i"
              @click.stop
            >
              <v-list-item-title
                @click="changeView(buildingTypeViews)"
                v-text="buildingTypeViews[0]"
              ></v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group
            no-action
            sub-group
            value="true"
            append-icon="dashboard"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Project documentation</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="(projectDocumentationViews,
              i) in projectDocumentationViews"
              :key="i"
              @click.stop
            >
              <v-list-item-title
                @click="changeView(projectDocumentationViews)"
                v-text="projectDocumentationViews[0]"
              ></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <v-row justify="center" align="center">
          <v-col>
            <StartView v-if="view == 'home'" />
            <BuildingType v-if="view == 'Building type'" />
            <ProjectDocumentation v-if="view == 'Project documentation'" />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import StartView from "./components/HelloWorld";
//import loading from "./subcomponents/LoadingAnimation";
const BuildingType = () => ({
  component: import("./components/BuildingType")
});
const ProjectDocumentation = () => ({
  component: import("./components/projectDocumentation/ProjectDocumentation")
});
export default {
  name: "App",
  components: {
    StartView,
    BuildingType,
    ProjectDocumentation
  },
  data: () => ({
    drawer: null,
    view: "home",
    buildingTypeViews: [["Building type", "building_type"]],
    projectDocumentationViews: [
      ["Project documentation", "project_documentation"]
    ]
  }),
  created() {
    console.log(this);
  },
  methods: {
    changeView(viewName) {
      // eslint-disable-next-line
      this.view = viewName[0];
      console.log("viewName: ", this.view);
    }
  }
};
</script>
