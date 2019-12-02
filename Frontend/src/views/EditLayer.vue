<template>
  <v-app>
    <v-card flat>
      <v-progress-linear
        :active="this.$store.getters.layersStatus == 'loading'"
        :indeterminate="this.$store.getters.layersStatus == 'loading'"
        absolute
        bottom
        height="4px"
        color="teal"
      ></v-progress-linear>
      <v-toolbar color="rgb(255,255,255)" flat>
        <v-toolbar-title>LAYERS</v-toolbar-title>
      </v-toolbar>
    </v-card>

    <v-snackbar v-model="snackbarSuccess" absolute top right color="success">
      <span>Layer saved successfully!</span>
      <v-icon dark>check_circle_outline</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarSuccessDeleted" absolute top right color="success">
      <span>Layer deleted successfully!</span>
      <v-icon dark>check_circle_outline</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarError" absolute top right color="error">
      <span>An error ocurred</span>
      <v-icon dark>close</v-icon>
    </v-snackbar>
    <v-snackbar v-model="snackbarEmpty" absolute top right color="error">
      <span>The layer name is empty!</span>
      <v-icon dark>close</v-icon>
    </v-snackbar>

    <v-list>
      <v-list-group v-for="layer in layers" v-bind:key="layer.id">
        <template v-slot:activator>
          <v-card flat>
            <v-card-title>
              <v-icon left>map</v-icon>
              {{ layer.name }}
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
                  <v-checkbox label="Visible" color="green" v-model="layer.visible"></v-checkbox>
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
              <v-container grid-list-xl>
                <v-layout row justify-space-between>
                  <v-btn color="red" outline depressed @click="showDialog(layer)">Delete</v-btn>

                  <v-dialog v-model="dialog" width="300">
                    <v-card>
                      <v-card-title class="headline blue-grey darken-1 white--text">Delete</v-card-title>
                      <v-card-text>
                        Are you sure you want to delete this
                        layer?
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="grey" outline depressed @click="dialog = false">Cancel</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="red" outline depressed @click="deleteLayer()">DELETE</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-btn text color="primary" depressed outline @click="save(layer)">Save</v-btn>
                </v-layout>
              </v-container>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-list-group>
    </v-list>
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
      snackbarError: false,
      snackbarEmpty: false,
      snackbarSuccess: false,
      snackbarSuccessDeleted: false,
      defaultForm,
      dialogId: "",
      layers: []
    };
  },
  mounted() {
    this.requestLayers();
  },
  methods: {
    showDialog(layer) {
      this.dialog = true;
      this.dialogId = layer.id;
    },
    requestLayers() {
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
      if (!layer.layerNameModel) {
        this.snackbarEmpty = true;
      } else {
        if (this.form.opacity == null) this.form.opacity = 50;
        var data = {
          name: layer.layerNameModel,
          opacity: layer.opacity,
          desc: layer.description,
          visible: this.visible(layer),
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
      }
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
    },
    visible(layer) {
      if (layer.visible) return 1;
      else return 0;
    }
  }
};
</script>

<style scoped type="text/css"></style>