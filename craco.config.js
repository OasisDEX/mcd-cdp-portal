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
      }
    },
    devServer: {
      hot: true
    }
  },
  babel: {
    plugins: ['styled-components', 'react-hot-loader/babel']
  },
  jest: {
    configure: {
      coverageReporters: ['json', 'lcov', 'text-summary'],
      setupFilesAfterEnv: '<rootDir>/test/setup.js'
    }
  }
};
