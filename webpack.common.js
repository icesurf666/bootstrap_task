// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  entry: ['./js/index.js', './css/style.css'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '',
  },
  optimization: {
    // chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) =>
                `${path.relative(path.dirname(resourcePath), context)}/`,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(html)$/,
        use: 'html-loader',
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset',
        generator: {
          filename: '[path][name]-[hash][ext]',
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: 'asset',
        generator: {
          filename: '[path][name]-[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/img/favicon'),
          to: path.resolve(__dirname, 'dist/img/favicon'),
        },
      ],
    }),
    ...glob.sync('./src/*.html').map(
      (htmlFile) =>
        new HtmlWebpackPlugin({
          inject: true,
          filename: path.basename(htmlFile),
          template: path.basename(htmlFile),
        }),
    ),
  ],
};
