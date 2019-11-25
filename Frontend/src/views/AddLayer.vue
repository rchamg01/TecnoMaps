<template>
  <v-app>
    <v-card flat>
      <v-toolbar flat tile color="rgb(255,255,255)">
        <v-toolbar-title>LAYER</v-toolbar-title>
      </v-toolbar>
      <v-snackbar v-model="snackbarSuccess" absolute top right color="success">
        <span>Registration successful!</span>
        <v-icon dark>mdi-checkbox-marked-circle</v-icon>
      </v-snackbar>
      <v-snackbar v-model="snackbarError" absolute top right color="error">
        <span>An error ocurred</span>
        <v-icon dark>mdi-close</v-icon>
      </v-snackbar>

      <v-form ref="form" @submit.prevent="submit">
        <v-container grid-list-xl>
          <v-layout row justify-space-between>
            <v-flex xs4>
              <v-text-field
                v-model="form.name"
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
                v-model="form.layerName"
                :rules="rules.layerName"
                label="Layer Name"
                placeholder="Layer Name"
                hint="Required field"
                clearable
                required
              ></v-text-field>
            </v-flex>

            <v-flex xs4>
              <v-text-field
                clearable
                v-model="form.layerSource"
                :rules="rules.source"
                label="Source"
                placeholder="Layer URL"
                hint="Required field"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row justify-space-between>
            <v-flex xs4>
              <v-slider
                v-model="form.opacity"
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
                clearable
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
              <v-checkbox label="Proxy" color="green"></v-checkbox>
            </v-flex>
            <v-flex xs4>
              <v-checkbox label="Secured" color="green"></v-checkbox>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-container grid-list-xl>
            <v-layout row justify-space-between>
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
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-form>
    </v-card>
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
      defaultForm
    };
  },
  computed: {
    formIsValid() {
      return this.form.name && this.form.layerSource && this.form.layerName;
    }
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

<style scoped type="text/css"></style>