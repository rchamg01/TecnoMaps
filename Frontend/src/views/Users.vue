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
        <v-text-field color="blue-grey darken-1" label="Search" v-model="search"></v-text-field>
      </v-toolbar>
    </v-card>
    <v-snackbar v-model="snackbarSuccess" absolute top right color="success">
      <span>Saved successfully!</span>
      <v-icon dark>check_circle_outline</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarSuccessDeleted" absolute top right color="success">
      <span>User deleted successfully!</span>
      <v-icon dark>check_circle_outline</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarError" absolute top right color="error">
      <span>An error ocurred</span>
      <v-icon dark>close</v-icon>
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
        <td width="30">
          <v-btn icon depressed @click="showDialog(users.item)">
            <v-icon color="black">delete_outline</v-icon>
          </v-btn>
        </td>
        <v-dialog light v-model="dialog" width="300">
          <v-card>
            <v-card-title class="headline blue-grey darken-1 white--text">Delete</v-card-title>
            <v-card-text>Are you sure you want to delete this user?</v-card-text>
            <v-card-actions>
              <v-btn color="grey" outline depressed @click="dialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red" outline depressed @click="deleteUser()">DELETE</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      snackbarError: false,
      snackbarSuccess: false,
      snackbarSuccessDeleted: false,
      dialogId: "",
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
        },
        {
          text: "Delete",
          value: "delete"
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
    showDialog(user) {
      this.dialog = true;
      this.dialogId = user.id;
    },
    requestUsers() {
      var data = this.$store.getters.getUser;
      this.$store
        .dispatch("getUsers")
        .then(() => {
          this.users = this.$store.getters.getUsers;
        })
        .catch(err => {
          this.snackbarError = true;
        });
    },
    deleteUser() {
      var data = {
        id: this.dialogId
      };
      this.$store
        .dispatch("deleteUser", data)
        .then(() => {
          this.snackbarSuccessDeleted = true;
          this.requestUsers();
        })
        .catch(err => {
          this.snackbarError = true;
        });
    }
  }
};
</script>

<style scoped type="text/css"></style>