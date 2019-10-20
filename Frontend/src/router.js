import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import AddLayer from "@/views/AddLayer";

Vue.use(Router);
const Principal = () => import("@/views/Principal");
const Map = () => import("./views/Map.vue");

export default new Router({
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
        }
      ]
    }
  ]
});
