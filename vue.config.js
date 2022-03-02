module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/vue-crypto-converter/" : "/",
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/styles/_variables.sass"`,
      },
    },
  },
};
