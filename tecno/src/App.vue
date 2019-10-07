<template>
  <v-app id="inspire">
    <v-content>
      <v-parallax height="1000" src="https://i.imgur.com/M21XVBk.jpg">
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
                    <v-toolbar-title>Login in</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-form @submit.prevent="sendLogin">
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
                        id="password"
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
                    >Login in</v-btn>
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
                        label="e-mail"
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
                        id="password"
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
                      v-on:click="sendSignUp"
                    >Sign up</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <v-carousel
      cycle
      height="300"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
      >
        <v-sheet
          :color="colors[i]"
          height="100%"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
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
        'indigo',
        'warning',
        'pink darken-2',
        'red lighten-1',
        'deep-purple accent-4',
      ],
      slides: [
        'First',
        'Second',
        'Third',
        'Fourth',
        'Fifth',
      ],
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
        alert("Rellene todos los campos");
      } else {
        var datos = {
          username: this.loginName,
          password: this.loginPass
        };
        this.$http.post(this.address + "/login/", datos).then(
          response => {
            if (response.body.login)
              this.$router.push({
                name: "HelloWorld",
                params: { user: datos.username }
              });
            else alert("Nombre o contraseña incorrectos");
          },
          response => {
            alert("Ha habido un error en el envío");
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
        alert("Rellene todos los campos");
      } else {
        var datos = {
          username: this.signName,
          password: this.signPass,
          email: this.email
        };
        this.$http.post(this.address + "/createUser/", datos).then(
          response => {
            if (response.body.signUp)
              this.$router.push({
                name: "HelloWorld",s
                params: { user: datos.username }
              });
            else
              alert("Ha habido un problema (el usuario podría estar añadido)");
          },
          response => {
            alert("Ha habido un error en el envío");
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
  background-color: #907A55;
}
</style>