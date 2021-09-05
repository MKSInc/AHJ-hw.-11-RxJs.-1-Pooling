const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Хеширование файлов только в production mode
function addHash(fileName, buildMode, hash = 'contenthash') {
  return buildMode === 'production' ? fileName.replace(/\.[^.]+$/, `.[${hash}]$&`) : fileName;
}

module.exports = (buildMode) => ({
  entry: {
    // Точка входа в корень сайта. Определяет язык и перенаправляет на соответствующую страницу.
    root: './src/js/root.js',
    // Общая точка входа для страниц с контентом на определенном языке.
    index: './src/index.js',
  },
  output: {
    path: path.resolve('..', 'AHJ-hw.-11-RxJs.-1-Pooling-Backend', 'public'),
    // path: path.resolve(__dirname, 'dist'),
    filename: addHash('[name].js', buildMode),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 3072,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html', // корень сайта, не содержит контента.
      filename: './index.html',
      chunks: ['root'], // 'root.js' только для корня сайта.
    }),
    new HtmlWebPackPlugin({
      template: './src/html/ru/index.html', // Версия страницы на русском.
      filename: './ru/index.html',
      chunks: ['index'], // 'index.js' основной js файл для всех страниц (кроме корня).
    }),
    new HtmlWebPackPlugin({
      template: './src/html/en/index.html', // Версия страницы на английском.
      filename: './en/index.html',
      chunks: ['index'],
    }),
    new MiniCssExtractPlugin({
      filename: addHash('[name].css', buildMode),
      chunkFilename: addHash('[id].css', buildMode),
    }),
  ],
});
