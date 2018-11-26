var config = require("./utils/config.js")


App({

  //启动微信小程序时会调用
  onLaunch: function () {
    var that = this;
    //登录：跟腾讯的服务器进行登录
    wx.login({
      success: function(res) {
        var code = res.code;
        var appid = config.appid;
        var secret = config.secret;
        //向腾讯的微信API服务器发送请求
        wx.request({
          url: "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code=" + code + "&grant_type=authorization_code",
          method: 'GET',
          success: function(res) {
            //console.log(res)
            //将openid保持的内存
            var openid = res.data.openid;
            that.globalData.openid = openid;
            //将数据同步的保存到磁盘
            wx.setStorageSync("OPENID", res.data.openid);
            //console.log(that)
          }
        })
      }
    })  
  },


  //所有页面共享的数据
  globalData: {
    status: 0,
    openid: ""
  }
})