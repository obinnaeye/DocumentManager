const path = require('path');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: production ? 'source-map' : 'eval-cheap-module-source-map',
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
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'client/public/js'),
    filename: 'bundle.min.js'
  }
};
