const path = require('path')

let config = {
  mode: 'development',
  entry: path.join(__dirname, './src/scripts/main.ts'),
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  }
}

module.exports = config