<template>
  <v-app>
    <v-card flat
      ><v-progress-linear
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
    </v-card>
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
        <td>{{ users.item.id }}</td>
        <td>{{ users.item.username }}</td>
        <td>{{ users.item.email }}</td>
        <td>{{ users.item.password }}</td>
        <td>
          <v-checkbox
            v-model="users.item.active"
            readonly="readonly"
            color="success"
            hide-details
          ></v-checkbox>
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
          text: "id",
          value: "id"
        },
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
          text: "active",
          value: "active"
        }
      ],
      users: [],
      readonly: true
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
