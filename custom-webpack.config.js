const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        BACKEND_URL: JSON.stringify(process.env.BACKEND_URL)
      }
    })
  ]
};
