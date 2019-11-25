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
    <!--<v-list>
      <v-list-group v-for="layer in layers" v-bind:key="layer.id">
        <template v-slot:activator>
          <v-card flat>
            <v-card-title>
              <v-icon left>map</v-icon>
              {{layer.name}}
            </v-card-title>
          </v-card>
        </template>

        <v-card flat>
          <v-form ref="form" @submit.prevent="submit">
            <v-container grid-list-xl>
              <v-layout row justify-space-between>
                <v-flex xs4>
                  <v-text-field
                    v-model="layer.layerNameModel"
                    :rules="rules.name"
                    label="Name"
                    placeholder="Name"
                    hint="Required field"
                    clearable
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="layer.layerName"
                    :rules="rules.layerName"
                    label="Layer Name"
                    placeholder="Layer Name"
                    hint="Required field"
                    clearable
                    required
                    disabled
                  ></v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="layer.url"
                    :rules="rules.source"
                    label="Source"
                    placeholder="Layer URL"
                    hint="Required field"
                    disabled
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row justify-space-between>
                <v-flex xs4>
                  <v-slider
                    v-model="layer.opacity"
                    :rules="rules.opacity"
                    color="orange"
                    label="Opacity"
                    min="1"
                    max="100"
                    thumb-label
                    thumb-size="25"
                    height="62"
                    dense
                  ></v-slider>
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="layer.description"
                    label="Description"
                    placeholder="Layer description"
                    hint="Optional field"
                  ></v-text-field>
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    label="Layer visibility minimum scale"
                    prepend-inner-icon="zoom_out"
                    placeholder="1:"
                    outlined
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row justify-space-between>
                <v-flex xs4>
                  <v-checkbox label="Visible" color="green" v-model="form.visible"></v-checkbox>
                </v-flex>
                <v-flex xs4>
                  <v-checkbox disabled label="Proxy" color="green"></v-checkbox>
                </v-flex>
                <v-flex xs4>
                  <v-checkbox disabled label="Secured" color="green"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red" outline depressed @click="showDialog(layer)">Delete</v-btn>

              <v-dialog v-model="dialog" width="500">
                <v-card>
                  <v-card-title class="headline blue-grey darken-1">Delete</v-card-title>
                  <v-card-text>Are you sure you want to delete this layer?</v-card-text>
                  <v-card-actions>
                    <v-btn color="grey" outline depressed @click="dialog = false">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="red" outline depressed @click="deleteLayer()">DELETE</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn text color="primary" depressed outline @click="save(layer)">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-list-group>
    </v-list>-->
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
    const defaultForm = Object.freeze({
      name: "",
      layerName: "",
      layerSource: "",
      opacity: 50,
      desc: "",
      visible: true
    });

    return {
      form: Object.assign({}, defaultForm),
      rules: {
        name: [val => (val || "").length > 0 || "This field is required"],
        source: [val => (val || "").length > 0 || "This field is required"],
        layerName: [val => (val || "").length > 0 || "This field is required"]
      },
      dialog: false,
      conditions: false,
      snackbarError: false,
      snackbarSuccess: false,
      snackbarSuccessDeleted: false,
      defaultForm,
      dialogId: "",

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
      users: [
        /* {
          userName: "rchamg01",
          email: "rchamg01@estudiantes.unileon.es",
          password: "1234",
          id: "1998"
        },
        {
          userName: "aferns16",
          email: "aferns16@estudiantes.unileon.es",
          password: "1236",
          id: "1999"
        },
        {
          userName: "gneid92",
          email: "gneid92@estudiantes.unileon.es",
          password: "5236",
          id: "2000"
        }*/
      ]
    };
  },
  computed: {
    formIsValid() {
      return this.form.name && this.form.layerSource && this.form.layerName;
    }
  },
  mounted() {
    this.requestUsers();
  },
  methods: {
    showDialog(layer) {
      this.dialog = true;
      this.dialogId = layer.id;
    },
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
    /*requestLayers() {
      var data = this.$store.getters.getUser;
      this.$store
        .dispatch("getLayers", data)
        .then(() => {
          this.layers = this.$store.getters.getLayers;
          for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].layerNameModel = this.layers[i].name;
          }
        })
        .catch(err => {
          this.snackbarError = true;
        });
    },
    save(layer) {
      if (this.form.opacity == null) this.form.opacity = 50;
      console.log(layer.id);
      var data = {
        name: layer.layerNameModel,
        opacity: layer.opacity,
        desc: layer.description,
        visible: layer.visible,
        id: layer.id,
        idUser: this.$store.getters.getUser.id
      };
      this.$store
        .dispatch("updateLayer", data)
        .then(() => {
          this.snackbarSuccess = true;
          this.requestLayers();
        })
        .catch(err => {
          this.snackbarError = true;
        });
    },
    deleteLayer() {
      var data = {
        id: this.dialogId,
        idUser: this.$store.getters.getUser.id
      };
      this.$store
        .dispatch("deleteLayer", data)
        .then(() => {
          this.snackbarSuccessDeleted = true;
          this.requestLayers();
        })
        .catch(err => {
          this.snackbarError = true;
        });
    }*/
  }
};
</script>

<style scoped type="text/css"></style>