<template>
<v-app>
    <v-card flat>
    <v-toolbar flat tile color="rgb(255,255,255)">
                    <v-toolbar-title>LAYER</v-toolbar-title>
                  </v-toolbar>
     <v-snackbar
        v-model="snackbar"
        absolute
        top
        right
        color="success"
      >
        <span>Registration successful!</span>
        <v-icon dark>mdi-checkbox-marked-circle</v-icon>
      </v-snackbar>

      <v-form ref="form" @submit.prevent="submit">
      <v-container grid-list-xl>
      <v-layout row justify-space-between>

        <v-flex xs4>
          <v-text-field
            v-model="form.layerName"
            :rules="rules.name"
            label="Name"
            placeholder="Layer name"
            hint="required field"
            
            clearable
            required
          ></v-text-field>
        </v-flex>

        <v-flex xs4>
          <v-text-field
            label="Description"
            placeholder="Layer description"
            hint="Optional field"
            
          ></v-text-field>
        </v-flex>

        <v-flex xs4>
          <v-text-field
          v-model="form.layerSource"
            :rules="rules.source"
            label="Source"
            placeholder="Layer source"
            hint="required field"
            
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
            label="Layer visibility maximum scale"
            prepend-inner-icon="zoom_in"           
            placeholder="1:"
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
      <v-checkbox
              label="Restricted layer"
              color="green"
            >
        </v-checkbox>
        </v-flex>
        <v-flex xs4>
      <v-checkbox
              label="Proxy"
              color="green"
            >
        </v-checkbox>
        </v-flex>
        <v-flex xs4>
      <v-checkbox
              label="Secured"
              color="green"
            >
        </v-checkbox>
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
          >Register</v-btn>
        </v-card-actions>
  </v-form>
  </v-card>
  </v-app>
</template>
<script>
  export default {
    data () {
      const defaultForm = Object.freeze({
        layerName: '',
        layerSource: '',
        opacity: 50,
      })

      return {
        form: Object.assign({}, defaultForm),
        rules: {
          name: [val => (val || '').length > 0 || 'This field is required'],
          source: [val => (val || '').length > 0 || 'This field is required'],
        },
        
        conditions: false,
        snackbar: false,
        defaultForm,
      }
    },

    computed: {
      formIsValid () {
        return (
          this.form.layerName &&
          this.form.layerSource
        )
      },
    },

    methods: {
      resetForm () {
        this.form = Object.assign({}, this.defaultForm)
        this.$refs.form.reset()
      },
      submit () {
        this.snackbar = true
        this.resetForm()
      },
    },
  }
</script>

<style scoped type="text/css">


</style>