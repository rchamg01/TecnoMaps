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
              <v-list-tile-title>{{ username }}</v-list-tile-title>
              <v-list-tile-sub-title>
                {{
                this.$store.getters.getUser_type.type_name
                }}
              </v-list-tile-sub-title>
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
        <v-list-tile>
          <v-list-tile-action></v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer dark height="50" app="app">
      <v-card flat tile class="blue-grey darken-3 white--text text-xs-center flex">
        <v-card-text>2020 Tecnomaps.</v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "Principal",
  data() {
    return {
      drawer: true,
      items: [
        {
          link: "/principal/",
          title: "Home",
          icon: "home"
        },
        {
          link: "/userProfile",
          title: "Profile",
          icon: "account_circle"
        },
        {
          link: "/addLayer",
          title: "Add Layer",
          icon: "library_add"
        },
        {
          link: "/editLayer",
          title: "Layer Management",
          icon: "create"
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
    this.requestUser_type();
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout", this.$store.getters.getUser).then(() => {
        this.$router.push("/");
      });
    },
    requestUser_type: function() {
      if (this.$store.getters.getUser == "") {
        this.$router.push({ name: "Login" });
      }
      this.$store
        .dispatch("getUser_type", {
          data: this.$store.getters.getUser.idType
        })
        .then(() => {
          if (this.$store.getters.getUser_type.type_name == "admin") {
            this.items.push({
              link: "/users",
              title: "User Management",
              icon: "supervised_user_circle"
            });
          }
        });
    }
  }
};
</script>
