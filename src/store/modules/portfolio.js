import currencies, { blankCurrencyObject } from "@/assets/currencies";
import { urls } from "@/assets/utils.js";
import { colors } from "@/assets/utils.js";

export default {
  state: {
    portfolio: currencies
      .filter((c) => c.apiId)
      .map((c) => {
        return { ...c, value: 0 };
      }),
    portfolioData: { ...blankCurrencyObject },
  },
  getters: {
    portfolio(state) {
      return state.portfolio;
    },
    portfolioData(state) {
      return state.portfolioData;
    },
    doughnutChartData(state, { portfolio, portfolioData }) {
      const X = [];
      const Y = [];

      for (const cur of portfolio) {
        if (!portfolioData[cur.apiId]) continue;

        const usd = portfolioData[cur.apiId].market_data.current_price.usd;
        X.push(cur.label);
        Y.push(cur.value * usd);
      }

      return { X, Y, colors };
    },
  },
  actions: {
    async fetchPortfolioData({ dispatch, getters }) {
      const promises = getters.portfolio.map((currency) =>
        dispatch("fetchPortfolioEntry", currency)
      );

      return await Promise.all(promises);
    },
    async fetchPortfolioEntry({ commit }, currency) {
      const res = await fetch(urls.portfolioData(currency.apiId));
      const data = await res.json();
      commit("updatePortfolioEntry", data);
    },
    fetchPortfolio({ commit, dispatch }) {
      const str = localStorage.getItem("portfolio");
      if (str) {
        try {
          commit("updatePortfolio", JSON.parse(str));
        } catch (err) {
          console.error("Couldn't load portfolio from localStorage:");
          console.error(err);
          dispatch("savePortfolio");
        }
      }
    },
    savePortfolio({ state }) {
      localStorage.setItem("portfolio", JSON.stringify(state.portfolio));
    },
    addValueToPortfolio({ commit, dispatch }, data) {
      commit("addValueToPortfolio", data);
      dispatch("savePortfolio");
    },
  },
  mutations: {
    updatePortfolio(state, portfolio) {
      state.portfolio = portfolio;
    },
    addValueToPortfolio(state, { apiId, value }) {
      const entryI = state.portfolio.findIndex((c) => c.apiId === apiId);
      const entry = state.portfolio[entryI];

      entry.value += value;
      if (entry.value < 0) {
        console.warn("Value in portfolio cannot be negative!");
        entry.value = 0;
      }

      state.portfolio.splice(entryI, 1, entry);
    },
    updatePortfolioEntry(state, data) {
      state.portfolioData[data.id] = data;
    },
  },
};
