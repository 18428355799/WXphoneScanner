//index.js
import Notify from '../../vant/notify/notify';
import Dialog from '../../vant/dialog/dialog';
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '扫一扫',
    userName: {},
    hasUserInfo: false,
    bxName:"",
    bxId: "",
    show: false,
    fpNumber: ""
  },
  cilkTianjia(){
    this.setData({
      show: true
    })
  },
  
  onClose(event) {
    if (event.detail === 'confirm') {
      // 异步关闭弹窗
      setTimeout(() => {
        this.setData({
          show: false
        });
      }, 1000);
    } else {
      this.setData({
        show: false
      });
    }
  },
  //获取用户输入
  bxNameInput: function (e) {
    this.setData({
      bxName: e.detail.value
    })
  },
  bxIdInput: function (e) {
    this.setData({
      bxId: e.detail.value
    })
  },
  fpNumberInput: function(e){
    this.setData({
      fpNumber: e.detail.value
    })
  },
  //手动添加发票
  addfp: function(e){
    if (this.data.bxName == "" || this.data.bxId == "" || this.data.fpNumber==""){
      Notify({
        text: "请确认信息是否填写完整！",
        duration: 3000,
        selector: '#custom-selector',
        backgroundColor: '#1989fa'
      });
    }else{
      var that  = this
      wx.request({
        url: app.globalData.ip + 'index',
        data: {
          qrContent: that.data.fpNumber,
          session_key: wx.getStorageSync("session_key"),
          bxName: that.data.bxName,
          bxId: that.data.bxId
        },
        method: 'GET',
        success: function (res) {
          console.log(res);
          Notify({
            text: res.data.msg + "\n" + "操作人：" + wx.getStorageSync("userName"),
            duration: 2000,
            selector: '#custom-selector',
            backgroundColor: '#1989fa'
          });
          setTimeout(function () { //延时
            Notify({
              text: res.data.data.content,
              duration: 2000,
              selector: '#custom-selector',
              backgroundColor: '#1989fa'
            })
          }, 3000) //设置掩饰时间
            ;
        },
        fail: function (err) {
          console.log(err);
          Notify({
            text: "网络请求失败！",
            duration: 4000,
            selector: '#custom-selector',
            backgroundColor: '#8B008B'
          })
        }
      })
    }
  },
  //按钮扫一扫事件
  getscanCode: function(envent) {  
    //console.log("123132")
    //调用扫码API
    var that = this
    wx.scanCode({
      scanType: ['qrCode'],
      success: res => {
        console.log(res);
        wx.request({
          url: app.globalData.ip + 'index',
          data: {
            qrContent: res.result,
            session_key: wx.getStorageSync("session_key"),
            bxName: that.data.bxName,
            bxId: that.data.bxId
          },
          method: 'GET',
          success: function(res) {
            console.log(res);
            Notify({
              text: res.data.msg + "\n" + "操作人："+wx.getStorageSync("userName"),
              duration: 2000,
              selector: '#custom-selector',
              backgroundColor: '#1989fa'
            });
            setTimeout(function() { //延时
              Notify({
                text: res.data.data.content,
                duration: 2000,
                selector: '#custom-selector',
                backgroundColor: '#1989fa'
              })
            }, 3000) //设置掩饰时间
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
    var name = wx.getStorageSync("userName")
    this.setData({
      userName: name,
      hasUserInfo: true
    })

  }
})