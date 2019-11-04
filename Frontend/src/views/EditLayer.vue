<template>
  <v-app>
    <v-toolbar flat tile color="rgb(255,255,255)">
      <v-toolbar-title>LAYERS</v-toolbar-title>
    </v-toolbar>

    <v-list>
      <v-list-group v-for="layer in layers" v-bind:key="layer.name">
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
                    v-model="layer.name"
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
                    v-model="form.desc"
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
              <v-btn text depressed outline @click="resetForm">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!formIsValid"
                text
                color="primary"
                type="submit"
                depressed
                outline
                @click="register"
              >Register</v-btn>
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
      conditions: false,
      snackbarError: false,
      snackbarSuccess: false,
      defaultForm,
      layers: []
    };
  },
  computed: {
    formIsValid() {
      return this.form.name && this.form.layerSource && this.form.layerName;
    }
  },
  mounted() {
    this.layers = this.$store.getters.getLayers;
  },
  methods: {
    resetForm() {
      this.form = Object.assign({}, this.defaultForm);
      this.$refs.form.reset();
    },
    submit() {
      this.resetForm();
    },
    register() {
      if (this.form.opacity == null) this.form.opacity = 50;
      var data = {
        name: this.form.name,
        layerName: this.form.layerName,
        url: this.form.layerSource,
        opacity: this.form.opacity,
        desc: this.form.desc,
        visible: this.form.visible,
        idUser: this.$store.getters.getUser.id
      };
      this.$store
        .dispatch("registerLayer", data)
        .then(() => (this.snackbarSuccess = true))
        .catch(err => {
          this.snackbarError = true;
        });
    }
  }
};
</script>

<style scoped type="text/css">
</style>