// pages/user/user.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    myteam: null,
    myinfo: null,
    stuName:null
  },
  goRegister() {
    if(app.globalData.userInfo){
      wx.navigateTo({
        url: "./register/register",
      })
    }else{
      wx.showModal({
        title: '尚未授权',
        content: '请先授权绑定微信信息',
        confirmText: '立即授权',
        confirmColor: '#7b85fe',
        cancelText: '拒绝授权',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  gologin(){
    wx.navigateTo({
      url: '/pages/user/login/login',
    })
  },
  goTeam() {
    if(!app.globalData.userInfo){
      wx.showModal({
        title: '尚未授权',
        content: '请先授权绑定微信信息',
        confirmText: '立即授权',
        confirmColor: '#7b85fe',
        cancelText: '拒绝授权',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else if (!app.globalData.stuNo) {
      wx.showModal({
        title: '尚未报名',
        content: '请先前往我的页面报名绑定身份信息',
        confirmText: '立即报名',
        confirmColor: '#7b85fe',
        cancelText: '暂不报名',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/register/register',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
    wx.getStorage({
      key: 'openid',
      success: (res)=>{
        const url='hxapi/api/Team/MyTeamInfo'
        util.ReqSend(url, {
          openID: res.data
        }).then(res=>{
          console.log(res)
          const data = JSON.parse(res.data)
          console.log(data)
          if (data.status == "1" && data.errorCode == "000") {
            wx.navigateTo({
              url: '/pages/team/teamInfo/teamInfo?info=' + JSON.stringify(data)
            })
          } else {
            wx.showToast({
              title: data.errorInfo,
              icon: 'none',
              duration: 4000
            })
            wx.navigateTo({
              url: "../team/new/new"
            })
          }
        })
      },
    })
  }
 
  },
  goUpload(){
    if(!app.globalData.userInfo){
      wx.showModal({
        title: '尚未授权',
        content: '请先授权绑定微信信息',
        confirmText: '立即授权',
        confirmColor: '#7b85fe',
        cancelText: '拒绝授权',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else if (!app.globalData.stuNo) {
      wx.showModal({
        title: '尚未报名',
        content: '请先前往我的页面报名绑定身份信息',
        confirmText: '立即报名',
        confirmColor: '#7b85fe',
        cancelText: '暂不报名',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/register/register',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else if(!app.globalData.myteam){
      wx.showModal({
        title: '尚未加入队伍',
        content: '请先前往我的团队加入队伍',
        confirmText: '立即加入',
        confirmColor: '#7b85fe',
        cancelText: '暂不加入',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "../team/new/new"
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/team/upload/upload',
      })
    }
    
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.stopPullDownRefresh()
    if(!app.globalData.userInfo){
      wx.showLoading({
        title: '网络获取中...',
      })
      setTimeout(()=>{
        wx.hideLoading()
      },1000)
    }
    if(app.globalData.userInfo){
      this.setData({
        userInfo:app.globalData.userInfo
      })
    }else {
      app.userInfoReadyCallback=res=>{
        this.setData({
          userInfo:res.userInfo
        })
      }
    }
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
    wx.getStorage({
      key: 'stuName',
      success: (res) => {
        console.log("用户名:",res.data);
        this.setData({
          stuName:res.data,
        })
      }
    })

    this.setData({
      userInfo:app.globalData.userInfo
    })

    wx.getStorage({
      key: 'openid',
      success: function (res) {
        const openID = res.data
        const url = 'hxapi/api/Team/MyTeamInfo'
          const query = {
            openID: openID
          }
          util.ReqSend(url, query).then((res) => {
            console.log(res)
            const data = JSON.parse(res.data)
            console.log(res.statusCode === 200)
            if (res.statusCode === 200) {
              app.globalData.myteam = data.TeamID
            }
           
          })
      }
    })
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