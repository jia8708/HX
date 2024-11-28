// pages/team/schools/schools.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shownames: [],
    allnames: [],
    page: 1,
    findpage:1,
    province: '',
    findschool: [],
    inputvalue:''
  },
  bindscrolltolower: function(e) {
    if (this.data.inputvalue) {
      let page = this.data.findpage + 1
      this.setData({
        findpage: page
      })
      this.loadMore()
    }else{
      let page = this.data.page + 1
      this.setData({
        page: page
      })
      this.loadMore()
    }
    
  },
  loadMore() {
    const url='hxapi/api/Team/HighSchoolList'
    wx.showLoading({
      title: '学校加载中',
      icon: 'none',
      duration: 2000
    })
    if(this.data.inputvalue){
      const query={
        pageIndex: this.data.findpage,
        province: this.data.province,
        schoolName: this.data.inputvalue
      }
      util.ReqSend(url,query).then(res=>{
        console.log(res)
        const data = JSON.parse(res.data)
        console.log(data)
        if (data.status == "1" && data.errorCode == "000") {
          if (data.data) {
            const showschool = data.data
            const allnames = this.data.shownames.concat(showschool)
            this.setData({
              shownames: allnames
            })
          } else {
            wx.showLoading({
              title: '没有更多',
            })
          }
        } else {
          wx.showToast({
            title: data.errorInfo,
            icon: 'none',
            duration: 4000
          })
        }
        wx.hideLoading()
      })
    }else{
      const query={
        pageIndex: this.data.findpage,
        province: this.data.province,
        schoolName: ""
      }
      util.ReqSend(url,query).then(res=>{
        console.log(res)
        const data = JSON.parse(res.data)
        console.log(data)
        if (data.status == "1" && data.errorCode == "000") {
          if (data.data) {
            const showschool = data.data
            const allnames = this.data.shownames.concat(showschool)
            this.setData({
              shownames: allnames
            })
          } else {
            wx.showLoading({
              title: '没有更多',
            })
          }
        } else {
          wx.showToast({
            title: data.errorInfo,
            icon: 'none',
            duration: 4000
          })
        }
        wx.hideLoading()
      })
    }
  },
  //防抖
  bindinput: function (e) {
    console.log(e)
    this.setData({
      inputvalue: e.detail.value,
      findpage: 1,
      page: 1
    })
    const url='hxapi/api/Team/HighSchoolList'
    wx.request({
      url: app.baseUrl + "/Team/HighSchoolList",
      method: 'POST',
      data: {
        pageIndex: this.data.findpage,
        province: this.data.province,
        schoolName: e.detail.value
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'bearer ' + app.globalData.token
      },
      success: (res) => {
        console.log(res)
        const data = JSON.parse(res.data)
        console.log(data)
        if (data.status == "1" && data.errorCode == "000") {
          if (this.data.inputvalue) {
            if (data.data) {
              const showschool = data.data
              this.setData({
                shownames: showschool
              })
            } else {
              //是否用上这个过程代码？？？？
              wx.showLoading({
                title: '没有更多',
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
            }
          } else {
            this.setData({
              shownames: []
            })
            this.loadMore()
          }

        } else {
          wx.showLoading({
            title: data.errorInfo
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.stopPullDownRefresh()
    this.setData({
        shownames: [],
        allnames: [],
        // choosename: '',
        page: 1,
      inputvalue:'',
        findpage: 1,
        findschool: []
    })
if(options){
  this.setData({
    province: options.province
  })
}
    this.loadMore()
  },
  //数据保存上一页
  choose: function(e) {
    console.log(e)
    var pages = getCurrentPages(); //  获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({
      schoolname: this.data.shownames[e.target.dataset.index].highSchool
    })
    wx.navigateBack({

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})