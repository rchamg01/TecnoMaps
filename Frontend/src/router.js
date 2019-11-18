import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import AddLayer from "@/views/AddLayer";
import EditLayer from "@/views/EditLayer";
import Users from "@/views/Users";
import store from "./store.js";
const Principal = () => import("@/views/Principal");
const Map = () => import("./views/Map.vue");
Vue.use(Router);

let router = new Router({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/principal",
      name: "Principal",
      component: Principal,
      children: [
        {
          path: "/",
          name: "Map",
          component: Map
        },
        {
          path: "/addlayer",
          name: "AddLayer",
          component: AddLayer
        },
        {
          path: "/editlayer",
          name: "EditLayer",
          component: EditLayer
        },
        {
          path: "/users",
          name: "Users",
          component: Users
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
