var config = require("../../utils/config.js")
var logger = require("../../utils/logUtils.js")

var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');

var qqMapSDK;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0.0,
    latitude: 0.0,
    controls: [],
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqMapSDK = new QQMapWX({
      key: config.mapKey
    });


    //this是当前页面对象
    //因为要修改当前页面对象中的数据，所有要将当前对象赋给一个拷贝
    var that = this;

    //获取手机的宽度、高度
    wx.getSystemInfo({
      //成功获取系统信息执行该方法
      success: function (res) {
        //获取可用高度和宽度
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;

        //将that设置新的属性（放入一些控件）
        that.setData({
          controls: [
            {
              //中心点位置
              id: 1,
              iconPath: '/images/location.png',
              position: {
                width: 20,
                height: 35,
                left: windowWidth / 2 - 10,
                top: windowHeight / 2 - 40.
              },
              //是否可点击
              clickable: true
            },
            {
              //扫码按钮
              id: 3,
              iconPath: '/images/qrcode.png',
              position: {
                width: 100,
                height: 40,
                left: windowWidth / 2 - 50,
                top: windowHeight - 60.
              },
              //是否可点击
              clickable: true
            },
            {
              //定位按钮安置
              id: 2,
              iconPath: '/images/img1.png',
              position: {
                width: 40,
                height: 40,
                left: 10,
                top: windowHeight - 60.
              },
              //是否可点击
              clickable: true
            },
            { //报修
              id: 6,
              iconPath: "/images/warn.png",
              position: {
                width: 35,
                height: 35,
                left: windowWidth - 42,
                top: windowHeight - 60.
              },
              //是否可点击
              clickable: true
            },
            { //添加单车
              id: 5,
              iconPath: "/images/add.png",
              position: {
                width: 35,
                height: 35
              },
              //是否可点击
              clickable: true
            }
          ]
        })
      },
    })

    //获取设备的位置信息
    wx.getLocation({
      success: function (res) {
        var log = res.longitude;
        var lat = res.latitude;
        //给当前的页面对象赋值
        //向页面中添加单车
        that.setData({
          longitude: log,
          latitude: lat
        })
        //初始化页面，查找单车
        findBikes(that);
      }
    })


  },

    

/**
 * 绑定控件点击事件
 */
controltap: function (e) {
  var that = this;
  var cid = e.controlId;

  // if(cid == 2) {
  //   //定位按钮
  //   //跳到原来的位置
  //   this.mapCtx.moveToLocation()
  // }

  switch (cid) {
    case 2: {
      //定位按钮
      //跳到原来的位置
      this.mapCtx.moveToLocation();
      break;
    }
    case 3: {
      //从全局数据中获取用户的状态
      var status = getApp().globalData.status;
      if (status == 0) {
        //跳转到注册页面
        wx.navigateTo({
          url: '../register/register',
        })
      }
      break;
    }
    case 5: {
      //将一个单车添加到data中markers的数组中（追加）
      //拿出来原来的markers
      //var bikes = this.data.markers
      //追加一个单车的json对象
      this.mapCtx.getCenterLocation({
        success: function (res) {
          var log = res.longitude;
          var lat = res.latitude;
          //向后台发送ajax请求
          wx.request({
            //小程序要求发送的是https请求
            url: config.webServer + "/bike/add",
            //请求方式
            method: 'POST',
            //请求时传参,小程序请求头是application/json
            data: {
              "longitude": log,
              "latitude": lat
            },
            //请求成功的回调函数
            success: function (res) {

              //单车添加成功后在查找单车
              findBikes(that)

            }
          })
        }
      })
      break;
    }
    case 6: {
      //跳转到报修页面
      wx.navigateTo({
        url: '../warn/warn',
      })
      //记录log，记录离开事件
      logger.log(qqMapSDK, "/kafka/access", {
        //离开页面
        "etype": 1,
        "page": "index"
      })
    }
     
  }


},

/**
 * 移动地图，视野变化时触发的事件
 */
regionchange: function(e) {
  var that = this;
  var type = e.type;
  if (type == 'end') {
    //移动到位置，获取当前的经纬度
    // this.mapCtx.getCenterLocation({
    //   success: function(res) {
    //     var log = res.longitude;
    //     var lat = res.latitude;
    //     //获取到移动后的经纬度
    //     //that.setData({
    //     //  longitude: log,
    //     //  latitude: lat
    //     //})
    //   }
    // })
  }
},

/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {
  //创建地图的上下文（保存者地图对象的信息）
  // 使用 wx.createMapContext 获取 map 上下文
  this.mapCtx = wx.createMapContext('myMap')
},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {
  
  //先取openid
  var openid = getApp().globalData.openid
  //openid有可能没有获取到
  var callback = setInterval(function(){
    //如果没有取得openid，睡一会，再取
    if(!openid) {
      openid = getApp().globalData.openid
    } else {
      //清除定时器
      clearInterval(callback);
      //记录log的日志服务器
      logger.log(qqMapSDK, "/kafka/access", {
        //事件类型：0代表进入，1代表离开
        "etype": 0,
        "page": "index"
      })
    }
  }, 1000)
  

},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function () {

},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {

},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function () {

},

/**
 * 用户点击右上角分享
 */
onShareAppMessage: function () {

}
})


function findBikes(that) {
  wx.request({
    url: config.webServer + "/bike/list",
    method: 'GET',
    data: {
      longitude: that.data.longitude,
      latitude: that.data.latitude
    },
    success: function (res) {
      //将每一辆单车取出来，整理成对应的格式
      var bikes = res.data.map((bike) => {
        return {
          id: bike.id,
          iconPath: '/images/bike.png',
          longitude: bike.longitude,
          latitude: bike.latitude,
          width: 35,
          height: 40
        }
      })
      //将查找到的数据再赋值给页面中markers
      that.setData({
        markers: bikes
      })
    }
  })

}