module.exports = {
  webpack: {
    plugins: [
      process.env.NODE_ENV === 'production'
        ? new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './report.html'
          })
        : () => {}
    ],
    configure: {
      output: {
        path: require('path').resolve(__dirname, 'build/')
      }
    }
  },
  babel: {
    plugins: ['styled-components']
  }
};
