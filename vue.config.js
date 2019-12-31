module.exports = {
    lintOnSave: false,
    devServer: {
      proxy: {
        '/api':{
          target:'http://localhost:8360',
          changeOrigin:true,
          pathRewrite: {
            '^/api': ''
          }
        },
        '/v1':{
          target:'https://api.huobi.pro',
          changeOrigin:true
        }
      }
    }
  }