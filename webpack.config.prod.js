const webpack = require('webpack')

module.exports = {
  entry: './src/Index.jsx',
  output: {
    filename: './dist/bundle.js'
  },
  resolve: {
    extensions: [".jsx", ".js"]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
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
  }
}
