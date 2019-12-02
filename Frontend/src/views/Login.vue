<template>
  <v-app id="inspire">
    <v-content>
      <v-parallax height="1000" src="https://i.imgur.com/M21XVBk.jpg">
        <v-snackbar v-model="alert" color="error" top right>
          <v-icon color="white">error_outline</v-icon>
          &nbsp;&nbsp;&nbsp; {{ alertContent }} &nbsp;&nbsp;&nbsp;
          <v-icon color="white" @click="alert = false">close</v-icon>
        </v-snackbar>

        <v-layout align-center row justify-space-around>
          <h1 class="display-4 font-weight-bold">
            <span style="color: white">TecnoMaps</span>
          </h1>
        </v-layout>
        <v-content>
          <v-container grid-list-md text-xs-center>
            <v-layout row justify-space-between fill-height>
              <v-flex xs6>
                <v-carousel cycle height="335" hide-delimiters>
                  <v-carousel-item
                    v-for="(slide, i) in slides"
                    :key="i"
                    :src="slide.src"
                    :position="slide.position"
                  >
                    <v-layout align-center justify-center fill-height>
                      <v-flex xs12 text-xs-center>
                        <div :class="slide.class">{{ slide.text }}</div>
                      </v-flex>
                    </v-layout>
                  </v-carousel-item>
                </v-carousel>
              </v-flex>
              <v-flex xs6>
                <v-tabs v-model="model" centered color="rgb(84, 110, 122,0.8)" dark slider-color="blue-grey lighten-4">
                  <v-tab ripple>SIGN UP</v-tab>
                  <v-tab ripple>LOG IN</v-tab>

                  <v-tab-item>
                    <!--SIGN-->
                    <v-card color="rgb(255,255,255,0.7)" flat class="elevation">
                      <v-card-text>
                        <v-form>
                          <v-text-field
                          color="#78909C"
                            prepend-icon="alternate_email"
                            name="e-mail"
                            label="E-mail"
                            type="text"
                            v-model="email"
                            :rules="rules.email"
                            hint="Required field"
                            v-on:keyup.enter="register"
                            clearable
                            required
                          ></v-text-field>
                          <v-text-field
                          color="#78909C"
                            prepend-icon="person"
                            name="signName"
                            label="Username"
                            type="text"
                            v-model="signName"
                            :rules="rules.signName"
                            hint="Required field"
                            v-on:keyup.enter="register"
                            clearable
                            required
                          ></v-text-field>
                          <v-text-field
                          color="#78909C"
                            prepend-icon="lock"
                            name="password"
                            label="Password"                           
                            v-model="signPass"
                            :rules="rules.signPass"
                            :append-icon="showSign ? 'visibility' : 'visibility_off'"
                            :type="showSign ? 'text' : 'password'"
                            @click:append="showSign = !showSign"
                            hint="Required field"
                            v-on:keyup.enter="register"
                            counter
                            clearable
                            required
                          ></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          round
                          depressed
                          class="white--text"
                          color="rgb(84, 110, 122, 0.7)"
                          @click="register"
                          :disabled="!signIsValid"
                          
                        >Sign up</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <!--item-->
                    <v-card  color="rgb(255,255,255,0.7)" flat class="elevation">
                      <v-card-text>
                        <v-form>
                          <v-text-field
                          color="#78909C"
                            prepend-icon="person"
                            name="username"
                            label="Username"
                            type="text"
                            v-model="loginName"
                            :rules="rules.loginName"
                            hint="Required field"
                            v-on:keyup.enter="login"
                            required
                          ></v-text-field>
                          <v-text-field
                          color="#78909C"
                            prepend-icon="lock"
                            name="password"
                            label="Password"
                            v-model="loginPass"
                            :rules="rules.loginPass"
                            :append-icon="showLogin ? 'visibility' : 'visibility_off'"
                            :type="showLogin ? 'text' : 'password'"
                            @click:append="showLogin = !showLogin"
                            hint="Required field"
                            clearable
                            required
                            v-on:keyup.enter="login"
                          ></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-toolbar flat class="white--text" color="rgb(255,255,255,0)"></v-toolbar>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          round
                          depressed
                          class="white--text"
                          color="rgb(84, 110, 122, 0.7)"
                          :disabled="!loginIsValid"
                          v-on:click="login" 
                          
                        > Login</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-flex>
            </v-layout>
          </v-container>
          <!-- -->
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
      model: "tab-2",
      loginName: null,
      loginPass: null,
      email: null,
      signName: null,
      signPass: null,
      alert: false,
      alertContent: "",
      slides: [
        {
          position: "center",
          text: "Visualiza capas",
          src: "https://i.imgur.com/Z7wQwW9.jpg",
          class: "display-1 white--text"
        },
        {
          position: "center",
          text: "Visualiza capas 2",
          src: "https://i.imgur.com/Z7wQwW9.jpg",
          class: "display-1 white--text"
        }
      ],
      rules: {
        loginName: [val => (val || "").length > 0 || "This field is required"],
        loginPass: [val => (val || "").length > 0 || "This field is required"],
        signName: [val => (val || "").length > 0 || "This field is required"],
        signPass: [val => (val || "").length > 0 || "This field is required", val => (val || "").length >= 8 || 'Min 8 characters'],
        email: [val => (val || "").length > 0 || "This field is required"]
      },
      showSign: false,
      showLogin: false
    };
  },
  computed: {
    loginIsValid() {
      return this.loginName && this.loginPass;
    },
    signIsValid() {
      return this.signName && this.signPass && this.email;
    }
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
          .then(() => {
            this.$router.push({ name: "Map" });
          })
          .catch(err => {
            if (err.message.includes("404")) {
              this.alertContent =
                "No se encontró el usuario o hubo un problema";
            } else if (err.message.includes("Network")) {
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
          .then(() => {
            this.$router.push({ name: "Map" });
          })
          .catch(err => {
            if (err.message.includes("404")) {
              this.alertContent = "Ese nombre de usuario ya está registrado";
            } else if (err.message.includes("Network")) {
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
.footer {
  opacity: 0.3;
  background-color: #907a55;
}
</style>