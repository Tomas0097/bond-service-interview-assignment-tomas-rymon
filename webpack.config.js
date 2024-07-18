const path = require('path');

module.exports = {
  entry: './src//web/static/src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'src/web/static/dist/js'),
    filename: 'build.js',
  },
  mode: 'development',
  devtool: false
};
