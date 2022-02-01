function round(num) {
  if (num > 10) return Math.round(num * 100) / 100;
  else if (num > 1) return Math.round(num * 10000) / 10000;
  else return Math.round(num * 10000000) / 10000000;
}

export { round };
