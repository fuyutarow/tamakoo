module.exports = {
  entry: './src/Index.jsx',
  output: {
    filename: '../dist/bundle.dev.js'
  },
  devtool: "source-map",
  resolve: {
    extensions: [".jsx", ".js"]
  },
  devServer: {
    historyApiFallback: true, // ここ追加
    hot: true,
    //contentBase: path.join(__dirname, 'public'),
    //port: 7000,
    //inline: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.svg$/,
        use: {
            loader: 'svg-url-loader',
            options: {
                noquotes: true
            }
        },
      },
      {
        test: /\.(jpg|png)$/,
        loaders: 'url-loader'
      },
    ]
  },
}
