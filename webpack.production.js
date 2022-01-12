const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                  warnings: false,
                  mangle: true,
                  ie8: false,
                  keep_fnames: false,
                  output: {
                    comments: false,
                    beautify: false
                  }
                }
            })
    ],
  },
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'geneEditor.min.js',
    library: "GeneEditor"
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({})
  ]
};