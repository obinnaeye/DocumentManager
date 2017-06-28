const path = require('path');
const webpack = require('webpack');

const debug = process.env.NODE_ENV !== 'production';
const production = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: debug ? 'inline-sourcemap' : 'cheap-eval-source-map',
  entry: path.join(__dirname, '/client/src/js/index.jsx'),

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|png|svg|jpeg)$/,
        loader: 'url-loader'
      }
    ]
  },
  target: 'web',
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'client/public/js'),
    filename: 'bundle.min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: production ?
        JSON.stringify('production') : JSON.stringify('development')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
