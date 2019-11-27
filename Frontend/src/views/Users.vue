<template>
  <v-app>
    <v-card flat>
      <v-progress-linear
        :active="this.$store.getters.usersStatus == 'loading'"
        :indeterminate="this.$store.getters.usersStatus == 'loading'"
        absolute
        bottom
        height="4px"
        color="teal"
      ></v-progress-linear>
      <v-toolbar color="rgb(255,255,255)" flat>
        <v-toolbar-title>USERS</v-toolbar-title>
      </v-toolbar>
      <v-toolbar color="rgb(255,255,255)" flat>
        <v-text-field label="Search" v-model="search"></v-text-field>
      </v-toolbar>
    </v-card>
    <v-snackbar v-model="snackbarSuccess" absolute top right color="success">
      <span>Saved successfully!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarSuccessDeleted" absolute top right color="success">
      <span>Deleted successfully!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarError" absolute top right color="error">
      <span>An error ocurred</span>
      <v-icon dark>mdi-close</v-icon>
    </v-snackbar>

    <v-data-table :headers="headers" :items="users" :search="this.search" hide-actions>
      <template slot="headerCell" slot-scope="{ header }">
        <span
          class="subheading font-weight-light text-success text--darken-3"
          v-text="header.text"
        />
      </template>
      <template v-slot:items="users">
        <td>{{ users.item.id }}</td>
        <td>{{ users.item.username }}</td>
        <td>{{ users.item.email }}</td>
        <td>{{ users.item.password }}</td>
        <td>
          <v-checkbox v-model="users.item.active" readonly="readonly" color="success" hide-details></v-checkbox>
        </td>
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
          text: "ID",
          value: "id"
        },
        {
          text: "Username",
          value: "username"
        },
        {
          text: "E-mail",
          value: "email"
        },
        {
          text: "Password",
          value: "password"
        },
        {
          text: "Active",
          value: "active"
        }
      ],
      users: [],
      readonly: true,
      search: ""
    };
  },
  computed: {},
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