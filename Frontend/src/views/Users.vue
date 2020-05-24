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
        <td>{{ users.item.firstname }} {{ users.item.lastname }}</td>
        <td>{{ users.item.email }}</td>
        <td>
          <v-checkbox v-model="users.item.active" :readonly="true" color="success" hide-details></v-checkbox>
        </td>
        <span width="30px">
          <v-btn icon depressed @click="showDeleteDialog(users.item)">
            <v-icon color="black">delete_outline</v-icon>
          </v-btn>
          <v-btn
            icon
            depressed
            :disabled="users.item.privacity=='private' && $store.getters.getUser_type.id == 3"
            @click.stop="showProfileDialog(users.item)"
          >
            <v-icon color="black">visibility</v-icon>
          </v-btn>
        </span>
        <v-dialog light persistent v-model="deleteDialog" width="300">
          <v-card>
            <v-card-title class="headline blue-grey darken-1 white--text">Delete</v-card-title>
            <v-card-text>Are you sure you want to delete this user?</v-card-text>
            <v-card-actions>
              <v-btn color="grey" outline depressed @click="deleteDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red" outline depressed @click="deleteUser()">DELETE</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog persistent v-model="profileDialog" width="500">
          <v-card>
            <v-card-title
              class="headline blue-grey darken-1 white--text"
            >{{ currentUser ? currentUser.username : ''}}</v-card-title>
            <v-card-text>
              <v-container grid-list-xl>
                <v-layout row>
                  <v-flex shrink pa-1>
                    <v-avatar size="90" color="grey lighten-4">
                      <img
                        src="https://i.pinimg.com/originals/47/1a/1a/471a1ad342659289433e05a611d206f8.png"
                        alt="avatar"
                      />
                    </v-avatar>
                  </v-flex>
                  <v-flex grow pa-1>
                    <v-card flat>
                      <v-card-title>
                        <div class="title font-weight-bold mb-0">
                          {{ currentUser ? currentUser.firstname : '' }}
                          {{ currentUser ? currentUser.lastname : '' }} ·
                          <font
                            class="font-weight-light"
                            color="grey"
                          >
                            {{
                            currentUser ? currentUser.username : ''
                            }}
                          </font>
                        </div>
                      </v-card-title>
                      <v-card-text>
                        <span class="font-weight-bold pa-0">User type:</span>
                        <v-select
                          dense
                          v-if="$store.getters.getUser_type.id == 1"
                          v-model="type"
                          :items="items"
                          item-value="id"
                          item-text="type_name"
                          return-object
                        />

                        <span
                          v-else
                        >&nbsp;{{ type ? type.type_name.charAt(0).toUpperCase() + type.type_name.slice(1) : '-' }}</span>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
                <v-container grid-list-md text-xs-left class="pa-0 mt-2">
                  <v-layout row wrap>
                    <v-flex xs6>
                      <span class="font-weight-bold">First name:</span>
                      {{ currentUser && currentUser.firstname ? currentUser.firstname : '-' }}
                    </v-flex>
                    <v-flex xs6>
                      <span class="font-weight-bold">Last name:</span>
                      {{ currentUser && currentUser.lastname ? currentUser.lastname : '-' }}
                    </v-flex>
                    <v-flex xs6>
                      <span class="font-weight-bold">Email:</span>
                      {{ currentUser && currentUser.email ? currentUser.email : '-' }}
                    </v-flex>
                    <v-flex xs6>
                      <span class="font-weight-bold">Phone Number:</span>
                      {{ currentUser && currentUser.phone_number ? currentUser.phone_number : '-' }}
                    </v-flex>
                    <v-flex xs6>
                      <span class="font-weight-bold">Address:</span>
                      {{ currentUser && currentUser.address ? currentUser.address : '-' }}
                    </v-flex>
                    <v-flex xs6>
                      <span class="font-weight-bold">City:</span>
                      {{ currentUser && currentUser.city ? currentUser.city : '-' }}
                    </v-flex>
                    <v-flex xs6>
                      <span class="font-weight-bold">Organization:</span>
                      {{ currentUser && currentUser.organization ? currentUser.organization : '-' }}
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="grey" outline depressed @click="profileDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue" outline depressed @click="save()">SAVE</v-btn>
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
      deleteDialog: false,
      profileDialog: false,
      currentUser: null,
      snackbarError: false,
      snackbarSuccess: false,
      snackbarSuccessDeleted: false,
      type: null,
      items: [],
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
          text: "Full name",
          value: "fullname"
        },
        {
          text: "E-mail",
          value: "email"
        },
        {
          text: "Active",
          value: "active"
        },
        {
          text: "Actions",
          value: "actions"
        }
      ],
      users: [],
      search: ""
    };
  },
  mounted() {
    this.requestUsers();
    this.$store.dispatch("getAllUser_types").then(userTypes => {
      this.items = userTypes;
    });
  },
  methods: {
    save() {
      var data = {
        idType: this.type.id,
        id: this.currentUser.id
      };
      this.$store
        .dispatch("editUser_type", {
          data: data
        })
        .then(() => {
          this.profileDialog = false;
          this.requestUsers();
          this.snackbarSuccess = true;
        })
        .catch(() => {
          this.snackbarError = true;
        });
    },
    showDeleteDialog(user) {
      this.deleteDialog = true;
      this.dialogId = user.id;
    },
    showProfileDialog(user) {
      this.$store
        .dispatch("getOtherUser_type", {
          data: user.idType
        })
        .then(userType => {
          this.type = userType;
          this.currentUser = user;
          this.profileDialog = true;
        });
    },
    requestUsers() {
      // var data = this.$store.getters.getUser;
      this.$store
        .dispatch("getUsers")
        .then(() => {
          this.users = this.$store.getters.getUsers;
        })
        .catch(() => {
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
        .catch(() => {
          this.snackbarError = true;
        });
    }
  }
};
</script>

<style scoped type="text/css"></style>