<template>
  <v-app id="inspire">
    <v-content>
      <v-parallax height="1000" src="https://i.imgur.com/M21XVBk.jpg">
        <v-alert :value="alert1" dense outlined type="error">
          <v-row align="center">
            <v-col class="grow">Rellene todos los campos</v-col>
            <v-col class="shrink">
              <v-btn color="info" outlined @click="alert1 = !alert1" left>Okey</v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-alert :value="alert2" dense outlined type="error">
          <v-row align="center">
            <v-col class="grow">Nombre o contraseña incorrectos</v-col>
            <v-col class="shrink">
              <v-btn color="info" outlined @click="alert2 = !alert2" left>Okey</v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-alert :value="alert3" dense outlined type="error">
          <v-row align="center">
            <v-col class="grow">Ha habido un error en el envío</v-col>
            <v-col class="shrink">
              <v-btn color="info" outlined @click="alert3 = !alert3" left>Okey</v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-alert :value="alert4" dense outlined type="error">
          <v-row align="center">
            <v-col class="grow">Ha habido un error (el usuario podría estar añadido)</v-col>
            <v-col class="shrink">
              <v-btn color="info" outlined @click="alert4 = !alert4" left>Okey</v-btn>
            </v-col>
          </v-row>
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
                      v-on:click="sendLogin"
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
                      @click="sendSignUp"
                    >Sign up</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <v-carousel cycle height="300" hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item v-for="(slide, i) in slides" :key="i">
              <v-sheet :color="colors[i]" height="100%">
                <v-row class="fill-height" align="center" justify="center">
                  <div class="display-3">{{ slide }} Slide</div>
                </v-row>
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
      alert1: false,
      alert2: false,
      alert3: false,
      alert4: false
    };
  },
  methods: {
    sendLogin: function() {
      if (this.address.includes("localhost"))
        this.address = "http://localhost:3000";
      if (
        this.loginName == null ||
        this.loginName == "" ||
        this.loginPass == null ||
        this.loginPass == ""
      ) {
        this.alert1 = true;
      } else {
        var datos = {
          username: this.loginName,
          password: this.loginPass
        };
        this.$http.post(this.address + "/login/", datos).then(
          response => {
            if (response.body.login)
              this.$router.push({
                name: "Principal",
                params: { user: datos.username }
              });
            else this.alert2 = true;
          },
          response => {
            this.alert3 = true;
          }
        );
      }
    },
    sendSignUp: function() {
      if (this.address.includes("localhost"))
        this.address = "http://localhost:3000";
      if (
        this.signName == null ||
        this.signName == "" ||
        this.signPass == null ||
        this.signPass == "" ||
        this.email == null ||
        this.email == ""
      ) {
        this.alert1 = true;
      } else {
        var datos = {
          username: this.signName,
          password: this.signPass,
          email: this.email
        };
        this.$http.post(this.address + "/createUser", datos).then(
          response => {
            if (response.body.signUp)
              this.$router.push({
                name: "Principal",
                params: { user: datos.username }
              });
            else this.alert4 = true;
          },
          response => {
            this.alert3 = true;
          }
        );
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