//logs.js
//const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';
import Notify from '../../vant/notify/notify';
const app = getApp()
Page({
  data: {
    logs: []
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    wx.request({
      url: app.globalData.ip +'crud',
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        that.setData({
          logs: res.data
        })
      },
      fail: function(err) {
        console.log(err);
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
      }
    })
  },
  //页面下拉。刷新
  onPullDownRefresh() {
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    wx.request({
      url: app.globalData.ip +'crud',
      method: 'GET',
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        that.setData({
          logs: res.data
        })
      },
      fail: function(err) {
        console.log(err);
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
      }
    })
  },
  //单击删除事件
  delete_inv: function(e) {
    //console.log(e.currentTarget.dataset.id)   //获取button按钮中绑定的属性值，用来删除该记录
    var invID = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '警告',
      content: '你确认要删除这条信息吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.ip +'delete',
            method: 'GET',
            data: {
              invID: invID
            },
            success: function (res) {
              console.log(res.data)
              Notify({
                text: "删除成功",
                duration: 3000,
                selector: '#custom-selector',
                backgroundColor: '#1989fa'

              });
              that.onLoad();    //刷新页面
            },
            fail: function (err) {
              Notify({
                text: "删除失败，请刷新重试",
                duration: 3000,
                selector: '#custom-selector',
                backgroundColor: '#1989fa'
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})