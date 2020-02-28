const alias = {};
if (process.env.NODE_ENV === 'development') {
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
      },
      // TODO: Remove once the scrypt.js "Critical dependency: the request of a dependency is an expression" issue is resolved
      // See: https://github.com/ethereum/web3.js/issues/3018
      module: {
        exprContextCritical: false
      }
    },
    devServer: {
      hot: true
    }
  },
  babel: {
    plugins: [
      'styled-components',
      'react-hot-loader/babel',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]
  },
  jest: {
    configure: {
      coverageReporters: ['json', 'lcov', 'text-summary'],
      setupFilesAfterEnv: '<rootDir>/test/setup.js',
      collectCoverageFrom: ['src/**/*.js']
    }
  }
};
