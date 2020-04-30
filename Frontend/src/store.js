import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    getUser: state => state.user,
    getLayers: state => state.layers,
    getUsers: state => state.users,
    getUser_type: state => state.user_type,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    layersStatus: state => state.layersStatus,
    usersStatus: state => state.usersStatus,
    user_typeStatus: state => state.user_typeStatus
  },

  state: {
    status: "",
    layersStatus: "",
    usersStatus: "",
    userStatus: "",
    user_typeStatus: "",
    token: localStorage.getItem("token") || "",
    user: "",
    layers: [],
    users: [],
    user_type: ""
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
    },
    update_avatar(state, avatar) {
      state.avatar = avatar;
    },
    update_layers(state, layers) {
      state.layers = layers;
    },
    layers_request(state) {
      state.layersStatus = "loading";
    },
    layers_success(state) {
      state.layersStatus = "success";
    },
    layers_error(state) {
      state.layersStatus = "error";
    },
    update_users(state, users) {
      state.users = users;
    },
    users_request(state) {
      state.usersStatus = "loading";
    },
    users_success(state) {
      state.usersStatus = "success";
    },
    users_error(state) {
      state.usersStatus = "error";
    },
    update_user_type(state, user_type) {
      state.user_type = user_type;
    },
    user_type_request(state) {
      state.user_typeStatus = "loading";
    },
    user_type_success(state) {
      state.user_typeStatus = "success";
    },
    user_type_error(state) {
      state.user_typeStatus = "error";
    },
    user_request(state) {
      state.userStatus = "loading";
    },
    user_success(state) {
      state.userStatus = "success";
    },
    user_error(state) {
      state.userStatus = "error";
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
    getUser({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit("user_request");
        axios({
          url: "http://localhost:3000/getUser",
          data: id,
          method: "GET"
        })
          .then(resp => {
            const user = resp.data.user;
            commit("user_success");
            commit("update_user", user);
            resolve(resp);
          })
          .catch(err => {
            commit("user_error");
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
    },
    getLayers({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("layers_request");
        axios({
          url: "http://localhost:3000/getLayers",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const layers = resp.data.layers;
            commit("layers_success");
            commit("update_layers", layers);
            resolve(resp);
          })
          .catch(err => {
            commit("layers_error");
            reject(err);
          });
      });
    },
    registerLayer({ commit }, layer) {
      return new Promise((resolve, reject) => {
        commit("layers_request");
        axios({
          url: "http://localhost:3000/registerLayer",
          data: layer,
          method: "POST"
        })
          .then(resp => {
            commit("layers_success");
            resolve(resp);
          })
          .catch(err => {
            commit("layers_ error", err);
            reject(err);
          });
      });
    },
    updateLayer({ commit }, layer) {
      return new Promise((resolve, reject) => {
        commit("layers_request");
        axios({
          url: "http://localhost:3000/updateLayer",
          data: layer,
          method: "POST"
        })
          .then(resp => {
            const layers = resp.data.layers;
            commit("layers_success");
            commit("update_layers", layers);
            resolve(resp);
          })
          .catch(err => {
            commit("layers_ error", err);
            reject(err);
          });
      });
    },
    deleteLayer({ commit }, layer) {
      return new Promise((resolve, reject) => {
        commit("layers_request");
        axios({
          url: "http://localhost:3000/deleteLayer",
          data: layer,
          method: "POST"
        })
          .then(resp => {
            const layers = resp.data.layers;
            commit("layers_success");
            commit("update_layers", layers);
            resolve(resp);
          })
          .catch(err => {
            commit("layers_ error", err);
            reject(err);
          });
      });
    },
    getUsers({ commit }) {
      return new Promise((resolve, reject) => {
        commit("users_request");
        axios({
          url: "http://localhost:3000/getUsers",
          method: "GET"
        })
          .then(resp => {
            const users = resp.data.users;
            commit("users_success");
            commit("update_users", users);
            resolve(resp);
          })
          .catch(err => {
            commit("users_error");
            reject(err);
          });
      });
    },
    getUser_type({ commit }, type) {
      return new Promise((resolve, reject) => {
        commit("user_type_request");
        axios({
          url: "http://localhost:3000/getUser_Type",
          data: type,
          method: "POST"
        })
          .then(resp => {
            const user_type = resp.data.user_type;
            commit("user_type_success");
            commit("update_user_type", user_type);
            resolve(resp);
          })
          .catch(err => {
            commit("user_type_error");
            reject(err);
          });
      });
    },
    deleteUser({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("users_request");
        axios({
          url: "http://localhost:3000/deleteUser",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const users = resp.data.users;
            commit("users_success");
            commit("update_users", users);
            resolve(resp);
          })
          .catch(err => {
            commit("users_error", err);
            reject(err);
          });
      });
    },
    saveAvatar({ commit }, avatar) {
      return new Promise((resolve, reject) => {
        axios({
          url: "http://localhost:3000/saveAvatar",
          data: avatar,
          method: "POST"
        })
          .then(resp => {
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
});
