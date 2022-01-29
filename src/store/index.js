import Vue from "vue";
import Vuex from "vuex";
import coingecko from "./modules/coingecko";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    coingecko,
  },
});
