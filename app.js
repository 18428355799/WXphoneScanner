//app.js
App({
  onLaunch: function() {
    //检查更新

  
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          console.log("版本有更新?:" +res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })

        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
        })
  





    // 登录
    //同步从缓存中获取key 对应的value
    //如果获取到的为null或undefined，则将user初始化空对象（ 即 {} ）
    //等价于
    // if(o)
    //  o = o;
    //  else
    //  o = {};  
    //本例只需要获取用户唯一ID即可,不需要授权获取用户昵称、头像、地区及性别
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //调用接口获取登录凭证（code）
        if (res.code) {
          var api = "https://api.weixin.qq.com/sns/jscode2session"
          //?appid=" + this.globalData.appid + "&secret=" + this.globalData.appsecret + "&js_code=" + res.code + "&grant_type=authorization_code";
          var appid = "appid="+this.globalData.appid;
          var secret = "&secret=" +this.globalData.appsecret;
          var js_code = "&js_code="+res.code;
          var grant = "&grant_type=authorization_code";
          wx.request({
            url: this.globalData.ip + "code", //在app.js 中用this
            method: "GET",
            data: {
              url: api,
              appid: appid,
              secrets : secret,
              code : js_code,
              grant : grant
            },
            success: res => {
              console.log("login  session_key:" + res.data)
              //获取到session_key，存入到本地缓存中，之后每次业务操作都需要Session_key
              wx.setStorageSync("session_key", res.data)
            },
            fail: err => {
              console.log(err)
            }
          })
        } else {
          console.log('获取openid失败!' + res.errMsg)
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 回调函数 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: { //全局变量  
    userInfo: null,
    //ip: "https://localhost/phone/",
    ip:"https://mesqrcode.liwinon.com/phone/",
    appid: "wxce0c4f38650cfe54",
    appsecret: "46ff72c849a207a31ae6559120cfce70"
  }
})