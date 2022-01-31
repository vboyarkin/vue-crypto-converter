import Vue from "vue";
import VueRouter from "vue-router";
import Converter from "@/views/Converter.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Converter",
    component: Converter,
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/Portfolio.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
