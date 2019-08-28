module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-windows10/'
    : '/',
  outputDir: 'docs'
}