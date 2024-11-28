// pages/login/login.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:null
  },
  bindGetUserInfo:function(res){
    console.log(res)
    //得到用用户信息
    if (res.detail.userInfo){
      app.globalData.userInfo=res.detail.userInfo
      wx.showToast({
        title: '登录成功',
        icon: "success",
        duration: 2000,
        success: (res) => {
          wx.switchTab({
            url: '/pages/user/user',
          })
        }
      })
  }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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