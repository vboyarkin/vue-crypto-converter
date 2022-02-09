function round(num) {
  if (num > 10) return Math.round(num * 100) / 100;
  else if (num > 1) return Math.round(num * 10000) / 10000;
  else return Math.round(num * 10000000) / 10000000;
}

const colors = [
  "#f67019",
  "#4dc9f6",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];

const urls = {
  price: (apiId, vsCurrencyId) =>
    `https://api.coingecko.com/api/v3/simple/price?ids=${apiId}&vs_currencies=${vsCurrencyId}`,
  chart: (apiId, vsCurrencyId) =>
    `https://api.coingecko.com/api/v3/coins/${apiId}/market_chart?vs_currency=${vsCurrencyId}&days=14`,
  portfolioData: (apiId) =>
    `https://api.coingecko.com/api/v3/coins/${apiId}?tickers=false&community_data=false&developer_data=false&sparkline=true`,
};

export { round, colors, urls };
