<template>
  <v-app id="inspire" :dark="themeMode == 'dark'">
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list dense>
        <v-list-group value="true">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Konfiguracja</v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <v-row justify="center" align="center">
          <v-col>
            <StartView v-if="view == 'home'" />
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

export default {
  name: "App",
  components: {
    StartView
  },
  data: () => ({
    drawer: null,
    view: "home"
  }),
  created() {
    console.log(this);
  }
};
</script>
