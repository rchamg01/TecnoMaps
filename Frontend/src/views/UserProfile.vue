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
              <image-input v-model="avatar">
                <div slot="activator">
                  <v-avatar
                    size="150px"
                    v-ripple
                    v-if="!this.$store.getters.getUser.profile_photo && !avatar"
                    class="grey lighten-3 mb-3"
                  >
                    <span>Click to add avatar</span>
                  </v-avatar>
                  <v-avatar size="150px" v-ripple v-else-if="avatar" class="mb-3">
                    <img :src="avatar.imageURL" alt="avatar" />
                  </v-avatar>
                  <v-avatar
                    size="150px"
                    v-ripple
                    v-else-if="this.$store.getters.getUser.profile_photo"
                    class="mb-3"
                  >
                    <img :src="this.$store.getters.getUser.profile_photo" alt="avatar" />
                  </v-avatar>
                </div>
              </image-input>
              <v-slide-x-transition>
                <div v-if="avatar && saved == false">
                  <v-btn
                    outline
                    depressed
                    color="grey"
                    @click="uploadImage"
                    :loading="saving"
                  >Save Avatar</v-btn>
                </div>
              </v-slide-x-transition>
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
import ImageInput from "@/components/ImageInput.vue";

export default {
  data() {
    return {
      dialog: false,
      snackbarError: false,
      avatar: null,
      saving: false,
      saved: false
    };
  },
  components: {
    ImageInput: ImageInput
  },
  watch: {
    avatar: {
      handler: function() {
        this.saved = false;
      },
      deep: true
    }
  },
  methods: {
    uploadImage() {
      this.saving = true;
      var data = {
        id: this.$store.getters.getUser.id,
        url: this.avatar.imageURL
      };
      this.savedAvatar();
      /*this.$store
        .dispatch("saveAvatar", data)
        .then(() => {
          this.$store
            .dispatch("getUser", this.$store.getters.getUser.id)
            .then(() => {
              this.savedAvatar();
            })
            .catch(err => {
              this.snackbarError = true;
            });
        })
        .catch(err => {
          this.snackbarError = true;
        });*/
    },
    savedAvatar() {
      this.saving = false;
      this.saved = true;
    },
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
