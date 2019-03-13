const alias = {};

if (process.env.NODE_ENV === 'development') {
  console.log('use alias');
  alias['react-dom'] = '@hot-loader/react-dom';
}

module.exports = {
  webpack: {
    alias,
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
    },
    devServer: {
      hotOnly: true
    }
  },
  babel: {
    plugins: ['styled-components', 'react-hot-loader/babel']
  }
};
