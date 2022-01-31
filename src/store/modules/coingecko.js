import currencies, { blankCurrencyObject } from "@/assets/currencies";

const priceUrl = (apiId, vsCurrencyId) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${apiId}&vs_currencies=${vsCurrencyId}`;
const chartUrl = (apiId, vsCurrencyId) =>
  `https://api.coingecko.com/api/v3/coins/${apiId}/market_chart?vs_currency=${vsCurrencyId}&days=14`;
const portfolioDataUrl = apiId =>
  `https://api.coingecko.com/api/v3/coins/${apiId}?tickers=false&community_data=false&developer_data=false&sparkline=true`;

export default {
  state: {
    chart: [],
    currencies,
    baseCurrency: currencies[0],
    counterCurrency: currencies[1],
    baseValue: 1,
    exchangeRate: 1,
    portfolio: currencies
      .filter(c => c.apiId)
      .map(c => {
        return { ...c, value: 0 };
      }),
    portfolioData: { ...blankCurrencyObject },
  },
  getters: {
    getChartData(state) {
      if (!state.chart) {
        console.warn("state.chart hasn't been loaded!");
        return null;
      }
      if (!state.chart.prices) {
        console.warn("state.chart.prices hasn't been loaded!");
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
        [...state.currencies.filter(c => c.apiId)],
        [...state.currencies.filter(c => c.vsCurrencyId)],
      ];
    },
    exchangeRate(state) {
      return state.exchangeRate;
    },
    baseValue(state) {
      return Math.round(state.baseValue * 10000000) / 10000000;
    },
    counterValue(state, getters) {
      return (
        Math.round(state.baseValue * getters.exchangeRate * 10000000) / 10000000
      );
    },
    portfolio(state) {
      return state.portfolio;
    },
    portfolioData(state) {
      return state.portfolioData;
    },
  },
  actions: {
    async fetchChart({ commit, getters: { baseCurrency, counterCurrency } }) {
      try {
        const res = await fetch(
          chartUrl(baseCurrency.apiId, counterCurrency.vsCurrencyId)
        );
        const chart = await res.json();

        commit("updateChart", chart);

        const prices = chart.prices;
        commit("updateExchangeRate", prices[prices.length - 1][1]);
      } catch (err) {
        console.error("Couldn't fetch chart from api:");
        console.error(err);
      }
    },

    async fetchPortfolioData({ dispatch, getters }) {
      const promises = getters.portfolio.map(currency =>
        dispatch("fetchPortfolioEntry", currency)
      );

      return await Promise.all(promises);
    },
    async fetchPortfolioEntry({ commit }, currency) {
      const res = await fetch(portfolioDataUrl(currency.apiId));
      const data = await res.json();
      commit("updatePortfolioEntry", data);
    },
    async selectBaseCurrency({ commit, dispatch, getters }, currency) {
      const oldBaseCurrency = getters.baseCurrency;
      fetch(priceUrl(oldBaseCurrency.apiId, currency.vsCurrencyId))
        .then(res => res.json())
        .then(json => {
          const rate = json[oldBaseCurrency.apiId][currency.vsCurrencyId];

          commit("updateBaseValue", getters.baseValue * rate);
        })
        .catch(err => {
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
    updateExchangeRate(state, rate) {
      state.exchangeRate = rate;
    },
    updatePortfolio(state, { label, value }) {
      const entry = state.portfolio.find(c => c.label === label);
      entry.value = value;
    },
    updatePortfolioEntry(state, data) {
      state.portfolioData[data.id] = data;
    },
  },
};
