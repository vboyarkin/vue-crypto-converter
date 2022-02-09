import Vue from "vue";
import Vuex from "vuex";
import coingecko from "./modules/coingecko";
import portfolio from "./modules/portfolio";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    coingecko,
    portfolio,
  },
});
