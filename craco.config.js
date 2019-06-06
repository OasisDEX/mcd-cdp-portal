const alias = {};
const webpack = require('webpack');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  alias['react-dom'] = '@hot-loader/react-dom';
}
const envData = () => {
  const env = dotenv.config().parsed;
  return Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
  });
};
module.exports = {
  webpack: {
    alias,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './report.html'
          })
        : () => {},
      new webpack.DefinePlugin(() => {
        const env = dotenv.config().parsed;
        return Object.keys(env).reduce((prev, next) => {
          prev[`process.env.${next}`] = JSON.stringify(env[next]);
        }, {});
      })
    ],
    configure: {
      output: {
        path: require('path').resolve(__dirname, 'build/')
      }
    },
    devServer: {
      hot: true
    }
  },
  babel: {
    plugins: ['styled-components', 'react-hot-loader/babel']
  }
};
