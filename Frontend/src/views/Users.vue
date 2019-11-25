<template>
  <v-app>
    <v-progress-linear
      :active="this.$store.getters.layersStatus == 'loading'"
      :indeterminate="this.$store.getters.layersStatus == 'loading'"
      color="teal"
      height="4px"
      bottom
    ></v-progress-linear>
    <v-toolbar flat tile color="rgb(255,255,255)">
      <v-toolbar-title>USERS</v-toolbar-title>
    </v-toolbar>

    <v-snackbar v-model="snackbarSuccess" absolute top right color="success">
      <span>Saved successfully!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarSuccessDeleted"
      absolute
      top
      right
      color="success"
    >
      <span>Deleted successfully!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarError" absolute top right color="error">
      <span>An error ocurred</span>
      <v-icon dark>mdi-close</v-icon>
    </v-snackbar>
   
    <v-data-table :headers="headers" :items="users" hide-actions>
      <template slot="headerCell" slot-scope="{ header }">
        <span
          class="subheading font-weight-light text-success text--darken-3"
          v-text="header.text"
        />
      </template>
      <template v-slot:items="users">
        <td>{{ users.item.username }}</td>
        <td>{{ users.item.email }}</td>
        <td>{{ users.item.password }}</td>
        <td>{{ users.item.id }}</td>
        <td>{{ users.item.active }}</td>
      </template>
    </v-data-table>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      conditions: false,
      snackbarError: false,
      snackbarSuccess: false,
      snackbarSuccessDeleted: false,

      headers: [
        {
          text: "username",
          value: "username"
        },
        {
          text: "e-mail",
          value: "email"
        },
        {
          text: "password",
          value: "password"
        },
        {
          text: "id",
          value: "id"
        },
        {
          text: "active",
          value: "active"
        }
      ],
      users: []
    };
  },
  computed: {    
  },
  mounted() {
    this.requestUsers();
  },
  methods: {
    requestUsers() {
      var data = this.$store.getters.getUser;
      this.$store
        .dispatch("getUsers")
        .then(() => {
          this.users = this.$store.getters.getUsers;
          //console.log(this.users);
        })
        .catch(err => {
          this.snackbarError = true;
        });
    }
  }
};
</script>

<style scoped type="text/css"></style>
