import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    getUser: state => state.user,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  },

  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: ""
  },
  mutations: {
    update_user(state, user) {
      state.user = user;
    },
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, token) {
      state.status = "success";
      state.token = token;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    }
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://localhost:3000/login",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const token = resp.data.token;
            const user = resp.data.user;
            localStorage.setItem("token", token);
            // Add the following line:
            axios.defaults.headers.common["Authorization"] = token;
            commit("auth_success", token);
            commit("update_user", user);
            resolve(resp);
          })
          .catch(err => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://localhost:3000/register",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const token = resp.data.token;
            const user = resp.data.user;
            localStorage.setItem("token", token);
            // Add the following line:
            axios.defaults.headers.common["Authorization"] = token;
            commit("auth_success", token);
            commit("update_user", user);
            resolve(resp);
          })
          .catch(err => {
            commit("auth_error", err);
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    logout({ commit }, user) {
      return new Promise(resolve => {
        commit("logout");
        axios({
          url: "http://localhost:3000/logout",
          data: user,
          method: "POST"
        });
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    }
  }
});
