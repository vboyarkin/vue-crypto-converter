const currencies = [
  { label: "BTC", apiId: "bitcoin", vsCurrencyId: "btc" },
  { label: "USD", vsCurrencyId: "usd" },
  { label: "ETH", apiId: "ethereum", vsCurrencyId: "eth" },
];
let blankCurrencyObject = {};
currencies.forEach((x) => (blankCurrencyObject[x.apiId] = undefined));

export default currencies;
export { blankCurrencyObject };
