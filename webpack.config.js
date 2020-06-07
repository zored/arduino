const path = require('path');

const babel = {
  plugins: [
    'check-es2015-constants',
    '@babel/plugin-transform-classes',
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        useBuiltIns: true,
      },
    ],
    '@babel/plugin-transform-block-scoped-functions',
    [
      '@babel/plugin-transform-block-scoping',
      {
        throwIfClosureRequired: true,
      },
    ],
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-parameters',
    [
      'module:fast-async',
      {
        spec: true,
      },
    ],
    '@babel/plugin-transform-shorthand-properties',
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