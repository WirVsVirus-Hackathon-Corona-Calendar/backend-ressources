module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    host: 'localhost',
  },
  transpileDependencies: [
    'vuetify',
  ],
};
