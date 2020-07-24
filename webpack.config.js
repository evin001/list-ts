const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const prod = process.env.NODE_ENV === 'production'
const config = require('./etc/config')
const firebase = require('./etc/firebase')

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.((woff(2)?)|ttf|eot|otf)(\?[a-z0-9#=&.]+)?$/,
        use: 'file-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]'
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.app.title,
      template: 'src/index.html',
    }),
    new webpack.DefinePlugin({
      FIREBASE: JSON.stringify(firebase),
    }),
  ],
  ...(!prod
    ? {
        devServer: {
          port: config.dev.port,
          open: false,
          hot: true,
          compress: true,
          stats: 'errors-only',
          overlay: true,
        },
      }
    : {}),
}
