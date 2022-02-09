import currencies from "@/assets/currencies";
import { urls } from "@/assets/utils.js";

export default {
  state: {
    chart: [],
    currencies,
    baseCurrency: currencies[0],
    counterCurrency: currencies[1],
    baseValue: 1,
  },
  getters: {
    getChartData(state) {
      if (!state.chart || !state.chart.prices) {
        console.warn("state.chart hasn't been loaded!");
        return null;
      }

      let res = { X: [], Y: [] };

      for (let i = 0; i < state.chart.prices.length; i++) {
        const [x, y] = state.chart.prices[i];
        res.X[i] = new Date(x);
        res.Y[i] = y;
      }

      return res;
    },
    currencies(state) {
      return state.currencies;
    },
    baseCurrency(state) {
      return state.baseCurrency;
    },
    counterCurrency(state) {
      return state.counterCurrency;
    },
    currencyOptions(state) {
      return [
        [...state.currencies.filter((c) => c.apiId)],
        [...state.currencies.filter((c) => c.vsCurrencyId)],
      ];
    },
    exchangeRate(state) {
      if (!state.chart || !state.chart.prices) return 1;

      return state.chart.prices[state.chart.prices.length - 1][1];
    },
    baseValue(state) {
      return Math.round(state.baseValue * 10000000) / 10000000;
    },
    counterValue(state, getters) {
      return (
        Math.round(state.baseValue * getters.exchangeRate * 10000000) / 10000000
      );
    },
    canSwitchCurrencies(state, { baseCurrency, counterCurrency }) {
      return baseCurrency.vsCurrencyId && counterCurrency.apiId;
    },
  },
  actions: {
    async fetchChart({ commit, getters: { baseCurrency, counterCurrency } }) {
      try {
        const res = await fetch(
          urls.chart(baseCurrency.apiId, counterCurrency.vsCurrencyId)
        );
        const chart = await res.json();

        commit("updateChart", chart);
      } catch (err) {
        console.error("Couldn't fetch chart from api:");
        console.error(err);
      }
    },
    async selectBaseCurrency({ commit, dispatch, getters }, currency) {
      const oldBaseCurrency = getters.baseCurrency;

      fetch(urls.price(oldBaseCurrency.apiId, currency.vsCurrencyId))
        .then((res) => res.json())
        .then((json) => {
          const rate = json[oldBaseCurrency.apiId][currency.vsCurrencyId];

          commit("updateBaseValue", getters.baseValue * rate);
        })
        .catch((err) => {
          console.error(
            "Couldn't fetch rate from api on changing base currency:"
          );
          console.error(err);
        });

      commit("updateBaseCurrency", currency);

      await dispatch("fetchChart");
    },
    async selectCounterCurrency({ commit, dispatch }, currency) {
      commit("updateCounterCurrency", currency);
      await dispatch("fetchChart");
    },
    async switchCurrencies({
      commit,
      dispatch,
      getters: { baseCurrency, counterCurrency },
    }) {
      if (!baseCurrency.vsCurrencyId || !counterCurrency.apiId) return;

      const oldBaseCurrency = baseCurrency;
      commit("updateBaseCurrency", counterCurrency);
      commit("updateCounterCurrency", oldBaseCurrency);

      dispatch("fetchChart");
    },

    updateCounterValue({ commit, getters }, value) {
      commit("updateBaseValue", value / getters.exchangeRate);
    },
  },
  mutations: {
    updateChart(state, chart) {
      state.chart = chart;
    },
    updateBaseCurrency(state, currency) {
      state.baseCurrency = currency;
    },
    updateCounterCurrency(state, currency) {
      state.counterCurrency = currency;
    },
    updateBaseValue(state, value) {
      state.baseValue = value;
    },
  },
};
