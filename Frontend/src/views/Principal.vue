<template>
  <v-app>
    <v-toolbar dark color="blue-grey darken-3">
      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar size="36px">
        <v-icon>fas fa-address-card</v-icon>
      </v-avatar>
      <v-btn flat v-on:click="logout">Log Out</v-btn>
    </v-toolbar>

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      hide-overlay
      stateless
      app="app"
      class="blue-grey darken-1"
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img
                src="https://banner2.kisspng.com/20180603/jx/kisspng-user-interface-design-computer-icons-default-stephen-salazar-photography-5b1462e1b19d70.1261504615280626897275.jpg"
              />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{username}}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          :to="item.link"
          active-class="white--text"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer dark height="50" app="app">
      <v-card flat tile class="blue-grey darken-3 white--text text-xs-center flex">
        <v-card-text>2019 Tecnomaps.</v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "Principal",
  data() {
    return {
      nombre: "",
      icons: [
        "fab fa-facebook",
        "fab fa-twitter",
        "fab fa-google-plus",
        "fab fa-linkedin",
        "fab fa-instagram"
      ],
      drawer: true,
      items: [
        {
          link: "/principal/",
          title: "Inicio",
          icon: "home"
        },
        {
          link: "/addLayer",
          title: "Añadir capa",
          icon: "library_add"
        }
      ],
      mini: true,
      right: null,
      app: true
    };
  },

  computed: {
    username: function() {
      return this.$store.getters.getUser.username;
    }
  },
  mounted() {
    if (this.$store.getters.getUser == "") {
      this.$router.push({ name: "Login" });
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout", this.$store.getters.getUser).then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>


