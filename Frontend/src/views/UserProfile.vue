<template>
  <v-app>
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
                  <p>Tipo: {{ this.$store.getters.getUser_type.type_name }}</p>
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
            <v-btn color="red" outline depressed>Delete</v-btn>

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
    return {};
  },
  methods: {}
};
</script>
