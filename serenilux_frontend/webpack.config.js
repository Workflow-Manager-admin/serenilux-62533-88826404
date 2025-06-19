const path = require('path');

module.exports = {
  module: {
    rules: [
      // Audio asset loader for mp3/wav files - enables importing sounds in React
      {
        test: /\.(mp3|wav)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/sounds'
            }
          }
        ]
      },
      // Add other existing rules below (e.g., babel, css) if needed:
      // { test: /\.js$/, use: ... }
    ]
  },
  // (Optional) output & resolve
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
