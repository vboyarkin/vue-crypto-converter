import currencies from "@/assets/currencies";

export default {
  state: {
    chart: [],
    currencies,
    baseCurrency: currencies[0],
    counterCurrency: currencies[1],
  },
  getters: {
    chartData(state) {
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
        [...state.currencies.filter(c => c.apiId)],
        [...state.currencies.filter(c => c.vsCurrencyId)],
      ];
    },
  },
  actions: {
    async fetchChart({ commit, state }) {
      let [c1, c2] = state.currencies;
      const url = `https://api.coingecko.com/api/v3/coins/${c1[1]}/market_chart?vs_currency=${c2[1]}&days=14`;

      try {
        let res = await fetch(url);
        let json = await res.json();
        json.prices = json.prices.map(p => [
          p[0],
          Math.round(100 * p[1]) / 100,
        ]);

        commit("updateChart", json);
      } catch (err) {
        console.error("Couldn't fetch data from api:");
        console.error(err);
      }
    },
    async selectBaseCurrency({ commit, dispatch }, currency) {
      commit("updateBaseCurrency", currency);
      dispatch("fetchChart");
    },
    async selectCounterCurrency({ commit, dispatch }, currency) {
      commit("updateCounterCurrency", currency);
      dispatch("fetchChart");
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
  },
};
