<template>
  <v-app id="inspire">
    <v-content>
      <v-parallax height="1000" src="https://i.imgur.com/M21XVBk.jpg">
        <v-alert :value="alert" dense outlined type="error">
          <v-flex align="center" name="error1">
            <v-flex class="grow">{{alertContent}}</v-flex>
            <v-flex class="shrink">
              <v-btn color="info" outlined @click="alert = !alert" left>OK</v-btn>
            </v-flex>
          </v-flex>
        </v-alert>
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
                <v-tabs v-model="model" centered color="#907A55" dark slider-color="yellow">
                  <v-tab ripple>SIGN UP</v-tab>
                  <v-tab ripple>LOGIN IN</v-tab>

                  <v-tab-item>
                    <!--SIGN-->
                    <v-card flat class="elevation">
                      <v-card-text>
                        <v-form>
                          <v-text-field
                            prepend-icon="alternate_email"
                            name="e-mail"
                            label="E-mail"
                            type="text"
                            v-model="email"
                            :rules="rules.email"
                            hint="Required field"
                            clearable
                            required
                          ></v-text-field>
                          <v-text-field
                            prepend-icon="person"
                            name="signName"
                            label="Username"
                            type="text"
                            v-model="signName"
                            :rules="rules.signName"
                            hint="Required field"
                            clearable
                            required
                          ></v-text-field>
                          <v-text-field
                            prepend-icon="lock"
                            name="password"
                            label="Password"
                            type="password"
                            v-model="signPass"
                            :rules="rules.signPass"
                            hint="Required field"
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
                          color="#907A55"
                          @click="register"
                          :disabled="!signIsValid"
                        >Sign up</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <!--item-->
                    <v-card flat class="elevation">
                      <v-card-text>
                        <v-form>
                          <v-text-field
                            prepend-icon="person"
                            name="login"
                            label="Login"
                            type="text"
                            v-model="loginName"
                            :rules="rules.loginName"
                            hint="Required field"
                            required
                          ></v-text-field>
                          <v-text-field
                            prepend-icon="lock"
                            name="password"
                            label="Password"
                            type="password"
                            v-model="loginPass"
                            :rules="rules.loginPass"
                            hint="Required field"
                            clearable
                            required
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
                          :disabled="!loginIsValid"
                          v-on:click="login"
                        >Login</v-btn>
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
      address: "http://" + location.host + ":3000",
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
        signPass: [val => (val || "").length > 0 || "This field is required"],
        email: [val => (val || "").length > 0 || "This field is required"]
      }
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
          .then(() => this.$router.push({ name: "Map" }))
          .catch(err => {
            if (err.status == 404) {
              this.alertContent =
                "No se encontró el usuario o hubo un problema";
            } else if (err.status == 500) {
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
            if (err.status == 404) {
              this.alertContent = "Ese nombre de usuario ya está registrado";
            } else if (err.status == 500) {
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