Page({
    data: {
      latitude:0,
      longitude:0,
      latMove:0,
      logMove:0,
      controls:[],
      markers:[],
    },
    //首次加载页面
    onLoad: function () {
      var that = this;
      wx.getLocation({
        success: function(res) {
          var log = res.longitude
          var lat = res.latitude
          that.setData({
            longitude : log,
            latitude :lat,
          })
        },
        
      })
      wx.getSystemInfo({
        success: function(res) {
          var windowHeight = res.windowHeight;
          var windowWidth = res.windowWidth;
          that.setData({
            controls: [
              {
                id: 1,//扫码解锁
                iconPath: '../../images/images/openLock_03.png',
                position: {
                  width: 100,
                  left: windowWidth/2-50,
                  top :windowHeight-50,
                },
                clickable:true,
              },
              {
                id: 2,//信仰充值
                iconPath: '../../images/images/recharge_03.png',
                position:{
                  left:windowWidth-40,
                  top :windowHeight-80,
                },
                clickable:true,
              },
              {
                id: 3,//报修
                iconPath: '../../images/images/recharge_05.png',
                position: {
                  left: windowWidth - 40,
                  top: windowHeight - 40,
                },
                clickable: true,
              },
              {
                id: 4,//定位
                iconPath: '../../images/images/location.png',
                position: {
                  left: 10,
                  top: windowHeight - 40,
                },
                clickable: true,
              },    
              {
                id: 5,//中心点
                iconPath: '../../images/images/location_cen.png',
                position: {
                  width:15,
                  left: windowWidth/2-8,
                  top: windowHeight/2-22,
                },
                clickable: true,
              },  
              {
                id: 6,//添加单车
                iconPath: '../../images/images/add_bike.png',
                position: {
                  width:15,
                  left: 10,
                  top: 10,
                },
                clickable: true,
              },                                
            ]
          })          
        },
      })
    },
    //控件被点击 
    controltap:function(e){
      var that = this;
      var cid = e.controlId;
      switch(cid){
        case 4:{
          this.mapCtx.moveToLocation();//回到原来地点
          break;
        }
        case 6:{//添加单车
          var bikes = that.data.markers;
          this.mapCtx.getCenterLocation({
            success: function(res){
              var log = res.longitude;
              var lat = res.latitude;
              // console.log(log);
              // console.log(lat);
              bikes.push({
                iconPath: '../../images/images/bike.png',
                width: 30,
                height: 30,
                longitude: log,
                latitude: lat,
              });
              that.setData({
                markers: bikes
              })
            }
          })
          break;
        }
      }
    },
    //移动后地图视野改变
    regionchange:function(e){
      // var that = this;
      // var etype = e.type;
      // var cid = e.controlId;
      // if(etype=='end'){
      //   this.mapCtx.getCenterLocation({
      //     success:function(res){
      //       that.setData({
      //         logMove:res.longitude,
      //         latMove:res.latitude,
      //       })
      //       console.log(that.data.latMove);
      //       console.log(that.data.logMove);

      //     }
      //   })
      // }
    },
    onReady:function(){
      this.mapCtx = wx.createMapContext('myMap')
    },
    

});
