<template>
<v-app>
    <v-card flat fill-height>
    
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

        <v-flex cols="6" md="4">
          <v-text-field
            v-model="form.layerName"
            :rules="rules.name"
            label="Name"
            placeholder="layer name"
            hint="required field"
            outlined
            clearable
            required
          ></v-text-field>
        </v-flex>

        <v-flex cols="6" md="4">
          <v-text-field
            label="Description"
            placeholder="layer description"
            hint="For example, xxxxx"
            outlined
          ></v-text-field>
        </v-flex>

        <v-flex cols="6" md="4">
          <v-text-field
          v-model="form.layerSource"
            :rules="rules.source"
            label="Source"
            placeholder="layer source"
            hint="required field"
            outlined
          ></v-text-field>
        </v-flex>
        </v-layout>
        <v-layout row wrap>
        <v-flex cols="6" md="4">
          <v-slider
                v-model="form.opacity"
                :rules="rules.opacity"
                color="orange"
                label="Opacity"
                min="1"
                max="100"
                thumb-label
              ></v-slider>
        </v-flex>

        <v-flex cols="6" md="4">
          <v-text-field
            label="Outlined"
            placeholder="Placeholder"
            hint="For example, flowers or used cars"
            outlined
          ></v-text-field>
        </v-flex>

        <v-flex cols="6" md="4">
          <v-text-field
            label="Outlined"
            placeholder="Placeholder"
            hint="For example, flowers or used cars"
            outlined
          ></v-text-field>
        </v-flex>

        
      </v-layout>
       </v-container>
      <v-card-actions>
          <v-btn text depressed outlined @click="resetForm">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!formIsValid"
            text
            color="primary"
            type="submit"
            depressed
            outlined
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