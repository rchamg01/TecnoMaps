<template>
  <v-app>
    <v-snackbar v-model="snackbarError" absolute top right color="error">
      <span>An error ocurred</span>
      <v-icon dark>close</v-icon>
    </v-snackbar>
    <v-container fluid>
      <v-card flat>
        <v-card-text>
          <v-layout row>
            <v-flex shrink pa-1>
              <v-avatar size="170" color="grey lighten-4">
                <img
                  src="https://i.pinimg.com/originals/47/1a/1a/471a1ad342659289433e05a611d206f8.png"
                  alt="avatar"
                />
              </v-avatar>
            </v-flex>
            <v-flex grow pa-1>
              <v-card flat>
                <v-card-title>
                  <div class="display-1 font-weight-bold mb-0">
                    {{ this.$store.getters.getUser.firstname }} {{ this.$store.getters.getUser.lastname}} ·
                    <font
                      class="font-weight-light"
                      color="grey"
                    >{{ this.$store.getters.getUser.username }}</font>
                  </div>
                </v-card-title>
                <v-card-text>
                  <p>Type: {{ this.$store.getters.getUser_type.type_name }}</p>
                  <p>E-mail: {{ this.$store.getters.getUser.email }}</p>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>

          <v-btn outline depressed color="grey">Change Avatar</v-btn>
          <v-layout row justify-space-between>
            <v-flex xs3>
              <v-text-field label="First Name"></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field label="Last Name"></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field label="Email Address"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout row justify-space-between>
            <v-btn color="red" outline depressed @click="showDialog()">Delete</v-btn>
            <v-dialog v-model="dialog" width="300">
              <v-card>
                <v-card-title class="headline blue-grey darken-1 white--text">Delete</v-card-title>
                <v-card-text>
                  Are you sure you want to delete your
                  user?
                </v-card-text>
                <v-card-actions>
                  <v-btn color="grey" outline depressed @click="dialog = false">Cancel</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="red" outline depressed @click="deleteUser()">DELETE</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn text color="primary" depressed outline>Save</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      snackbarError: false
    };
  },
  methods: {
    showDialog() {
      this.dialog = true;
    },
    deleteUser() {
      var data = {
        id: this.$store.getters.getUser.id
      };
      this.$store
        .dispatch("logout", this.$store.getters.getUser)
        .then(() => {
          this.$router.push("/");
          this.$store.dispatch("deleteUser", data).catch(err => {
            this.snackbarError = true;
          });
        })
        .catch(err => {
          this.snackbarError = true;
        });
    }
  }
};
</script>
