const path = require('path');

const babel = {
  plugins: [
    ['transform-object-rest-spread', {useBuiltIns: true}],
    'check-es2015-constants',
    'transform-es2015-block-scoped-functions',
    ['transform-es2015-block-scoping', {throwIfClosureRequired: true}],
    'transform-es2015-spread',
    'transform-es2015-destructuring',
    'transform-es2015-parameters',
    'transform-es2015-shorthand-properties',
    ['fast-async', {spec: true}],
    'transform-es2015-classes',
  ],
};

module.exports = {
  entry: [
    './sketch/ts/_config/promise-fix.js',
    './dist/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'result.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babel,
        },
      },
    ],
  },
};