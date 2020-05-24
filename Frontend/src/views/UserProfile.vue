<template>
  <v-app>
    <v-snackbar v-model="snackbarError" absolute top right color="error">
      <span>An error ocurred</span>
      <v-icon dark>close</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarSuccess" absolute top right color="success">
      <span>User saved successfully!</span>
      <v-icon dark>check_circle_outline</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarPass" absolute top right color="error">
      <span>Wrong password!</span>
      <v-icon dark>close</v-icon>
    </v-snackbar>
    <v-card flat>
      <v-container grid-list-xl>
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
                  {{ this.$store.getters.getUser.firstname }}
                  {{ this.$store.getters.getUser.lastname }} ·
                  <font
                    class="font-weight-light"
                    color="grey"
                  >
                    {{
                    this.$store.getters.getUser.username
                    }}
                  </font>
                </div>
              </v-card-title>
              <v-card-text>
                <p>
                  <b>User type:</b>
                  {{ this.$store.getters.getUser_type.type_name.charAt(0).toUpperCase() + this.$store.getters.getUser_type.type_name.slice(1) }}
                </p>
                <p>
                  <v-switch
                    v-model="form.privacity"
                    :label="form.privacity==1 ? 'Public' : 'Private'"
                  ></v-switch>
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>

        <v-btn outline depressed color="grey">Change Avatar</v-btn>

        <v-layout row justify-space-between>
          <v-flex xs4>
            <v-text-field
              prepend-icon="person"
              v-model="form.name"
              :rules="rules.name"
              label="First Name"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              prepend-icon="person"
              v-model="form.lastName"
              :rules="rules.lastName"
              label="Last Name"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              prepend-icon="mail"
              v-model="form.email"
              :rules="rules.email"
              label="Email Address"
              disabled
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row justify-space-between>
          <v-flex xs4>
            <v-text-field
              prepend-icon="contact_phone"
              v-model="form.phone"
              label="Phone number"
              hint="Optional field"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              prepend-icon="home_work"
              v-model="form.address"
              label="Address"
              hint="Optional field"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              prepend-icon="location_city"
              v-model="form.city"
              label="City"
              hint="Optional field"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-text-field
              prepend-icon="business"
              v-model="form.organization"
              label="Organization"
              hint="Optional field"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row justify-space-between>
          <v-card-title class="title">Password change</v-card-title>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-text-field
              color="#78909C"
              prepend-icon="lock"
              name="password"
              label="Old password"
              v-model="oldPass"
              :rules="rules.oldPass"
              :append-icon="showOldPass ? 'visibility' : 'visibility_off'"
              :type="showOldPass ? 'text' : 'password'"
              @click:append="showOldPass = !showOldPass"
              hint="Required field"
              counter
              clearable
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              color="#78909C"
              prepend-icon="lock"
              name="password"
              label="New password"
              v-model="newPass"
              :rules="rules.newPass"
              :append-icon="showNewPass ? 'visibility' : 'visibility_off'"
              :type="showNewPass ? 'text' : 'password'"
              @click:append="showNewPass = !showNewPass"
              hint="Required field"
              counter
              clearable
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-card-actions>
          <v-container>
            <v-layout row justify-space-between>
              <v-btn color="red" outline depressed @click="showDialog()">Delete</v-btn>
              <v-dialog v-model="dialog" width="300">
                <v-card>
                  <v-card-title class="headline blue-grey darken-1 white--text">Delete</v-card-title>
                  <v-card-text>Are you sure you want to delete your user?</v-card-text>
                  <v-card-actions>
                    <v-btn color="grey" outline depressed @click="dialog = false">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="red" outline depressed @click="deleteUser()">DELETE</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn
                text
                color="primary"
                depressed
                :disabled="!formIsValid"
                outline
                @click="save()"
              >Save</v-btn>
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data() {
    const form = {
      name: this.$store.getters.getUser.firstname
        ? this.$store.getters.getUser.firstname
        : "",
      lastName: this.$store.getters.getUser.lastname
        ? this.$store.getters.getUser.lastname
        : "",
      email: this.$store.getters.getUser.email,
      phone: this.$store.getters.getUser.phone_number
        ? this.$store.getters.getUser.phone_number
        : "",
      address: this.$store.getters.getUser.address
        ? this.$store.getters.getUser.address
        : "",
      city: this.$store.getters.getUser.city
        ? this.$store.getters.getUser.city
        : "",
      organization: this.$store.getters.getUser.organization
        ? this.$store.getters.getUser.organization
        : "",
      privacity:
        this.$store.getters.getUser.privacity == "private" ? false : true
    };
    return {
      rules: {
        name: [val => (val || "").length > 0 || "This field is required"],
        lastName: [val => (val || "").length > 0 || "This field is required"],
        email: [val => (val || "").length > 0 || "This field is required"],
        oldPass: [val => (val || "").length > 0 || "This field is required"],
        newPass: [
          val => (val || "").length > 0 || "This field is required",
          val => (val || "").length >= 8 || "Min 8 characters"
        ]
      },
      oldPass: "",
      newPass: "",
      form,
      showOldPass: false,
      showNewPass: false,
      dialog: false,
      snackbarError: false,
      snackbarSuccess: false,
      snackbarPass: false
    };
  },
  computed: {
    formIsValid() {
      return this.form.name && this.form.lastName;
    }
  },
  methods: {
    showDialog() {
      this.dialog = true;
    },
    save() {
      if (
        (this.oldPass != "" &&
          this.oldPass == this.$store.getters.getUser.password) ||
        this.oldPass == ""
      ) {
        var data = {
          id: this.$store.getters.getUser.id,
          pass:
            this.newPass != ""
              ? this.newPass
              : this.$store.getters.getUser.password,
          firstName: this.form.name,
          lastName: this.form.lastName,
          phone: this.form.phone,
          address: this.form.address,
          city: this.form.city,
          organization: this.form.organization,
          privacity: this.form.privacity == true ? "public" : "private"
        };
        this.$store
          .dispatch("updateUser", data)
          .then(() => {
            this.snackbarSuccess = true;
          })
          .catch(() => {
            this.snackbarError = true;
          });
      } else this.snackbarPass = true;
    },
    deleteUser() {
      var data = {
        id: this.$store.getters.getUser.id
      };
      this.$store
        .dispatch("logout", this.$store.getters.getUser)
        .then(() => {
          this.$router.push("/");
          this.$store.dispatch("deleteUser", data).catch(() => {
            this.snackbarError = true;
          });
        })
        .catch(() => {
          this.snackbarError = true;
        });
    }
  }
};
</script>
