//index.js
import Notify from '../../vant/notify/notify';
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '扫一扫',
    userInfo: {},
    hasUserInfo: false,
  },
  //按钮单击事件

  getscanCode: function(envent) {

    //console.log("123132")
    //调用扫码API
    wx.scanCode({
      scanType: ['qrCode'],
      success: res => {
        //console.log(res);
        wx.request({
          url: app.globalData.ip+'index',
          data: {
            qrContent: res.result
          },
          method: 'GET',
          success: function(res) {
            console.log(res);
            Notify({
              text: res.data.msg,
              duration: 2000,
              selector: '#custom-selector',
              backgroundColor: '#1989fa'
            });
            setTimeout(function(){  //延时
              Notify({
                text: res.data.data.content,
                duration: 3000,
                selector: '#custom-selector',
                backgroundColor: '#1989fa'
              })
            },2000)
            ;
          },
          fail: function(err) {
            console.log(err);
            Notify({
              text: "网络请求失败！",
              duration: 4000,
              selector: '#custom-selector',
              backgroundColor: '#8B008B'
            })
          }
        })
      },
      fail: err => {
        Notify({
          text: "解析二维码失败!",
          duration: 4000,
          selector: '#custom-selector',
          backgroundColor: '#8B008B'
        })
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})