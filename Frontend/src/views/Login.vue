<template>
  <v-app id="inspire">
    <v-content>
      <v-parallax height="1000" src="https://i.imgur.com/M21XVBk.jpg">
        <v-alert :value="alert" dense outlined type="error">
          <v-flex align="center" name="error1">
            <v-flex class="grow">{{alertContent}}</v-flex>
            <v-flex class="shrink">
              <v-btn color="info" outlined @click="alert = !alert" left>Okey</v-btn>
            </v-flex>
          </v-flex>
        </v-alert>
        <v-layout align-center column justify-center>
          <h1 class="display-4 font-weight-bold">
            <span style="color: white">TecnoMaps</span>
          </h1>
        </v-layout>
        <v-content>
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap fill-height>
              <v-flex d-flex>
                <v-card flat class="elevation">
                  <v-toolbar flat class="white--text" color="#907A55">
                    <v-toolbar-title>Login</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        prepend-icon="person"
                        name="login"
                        label="Login"
                        type="text"
                        v-model="loginName"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="lock"
                        name="password"
                        label="Password"
                        type="password"
                        v-model="loginPass"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-toolbar flat class="white--text" color="white"></v-toolbar>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      round
                      depressed
                      class="white--text"
                      color="#907A55"
                      v-on:click="login"
                    >Login</v-btn>
                  </v-card-actions>
                </v-card>
                <v-card flat class="elevation">
                  <v-toolbar flat class="white--text" color="#907A55">
                    <v-toolbar-title>Sing up</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        prepend-icon="alternate_email"
                        name="e-mail"
                        label="E-mail"
                        type="text"
                        v-model="email"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="person"
                        name="signName"
                        label="Username"
                        type="text"
                        v-model="signName"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="lock"
                        name="password"
                        label="Password"
                        type="password"
                        v-model="signPass"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      round
                      depressed
                      class="white--text"
                      color="#907A55"
                      @click="register"
                    >Sign up</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <v-carousel cycle height="300" hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item v-for="(slide, i) in slides" :key="i">
              <v-sheet :color="colors[i]" height="100%">
                <v-flex class="text-xs-center" align="center" justify="center" name="slide">
                  <div class="display-3">{{ slide }} Slide</div>
                </v-flex>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-content>
      </v-parallax>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      address: "http://" + location.host + ":3000",
      loginName: null,
      loginPass: null,
      email: null,
      signName: null,
      signPass: null,
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4"
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
      alert: false,
      alertContent: ""
    };
  },

  methods: {
    login: function() {
      if (
        this.loginName == null ||
        this.loginName == "" ||
        this.loginPass == null ||
        this.loginPass == ""
      ) {
        this.alertContent = "Rellene todos los campos";
        this.alert = true;
      } else {
        let username = this.loginName;
        let password = this.loginPass;
        this.$store
          .dispatch("login", { username, password })
          .then(() => this.$router.push({ name: "Map" }))
          .catch(err => {
            if ((err.status = 404)) {
              this.alertContent = "No se encontró el usuario";
            } else if ((err.status = 500)) {
              this.alertContent = "Hubo un problema en el envío";
            }
            this.alert = true;
          });
      }
    },

    register: function() {
      if (
        this.signName == null ||
        this.signName == "" ||
        this.signPass == null ||
        this.signPass == "" ||
        this.email == null ||
        this.email == ""
      ) {
        this.alertContent = "Rellene todos los campos";
        this.alert = true;
      } else {
        let data = {
          username: this.signName,
          email: this.email,
          password: this.signPass
        };
        this.$store
          .dispatch("register", data)
          .then(() => this.$router.push({ name: "Map" }))
          .catch(err => {
            if ((err.status = 404)) {
              this.alertContent = "Ese nombre de usuario ya está registrado";
            } else if ((err.status = 500)) {
              this.alertContent = "Hubo un problema en el envío";
            }
            this.alert = true;
          });
      }
    }
  }
};
</script>
<style scoped type="text/css">
header {
  background-color: white;
  text-align: center;
}

.elevation {
  border-radius: 30px;
}

.footer {
  opacity: 0.3;
  background-color: #907a55;
}
</style>