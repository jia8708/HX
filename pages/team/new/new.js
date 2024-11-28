// pages/team/new/new.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  gocreate() {
    wx.navigateTo({
      url: '../create/create',
    })
  },
  join(){
    wx.switchTab({
      url: '/pages/team/team',
    })
  },
  goregister() {
    wx.navigateTo({
      url: '/pages/user/register/register',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请在此页面选择新建队伍或者加入队伍'
    })
    setTimeout(function(){
      wx.hideLoading()
    },1000)

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