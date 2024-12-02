// pages/team/team.js
const app = getApp()
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showinfo: [],
    allschoolname: [],
    page: 1,
    findpage: 1,
    inputvalue: ''
  },
  bindscrolltolower: function (e) {
    if (this.data.inputvalue) {
      let page = this.data.findpage + 1
      this.setData({
        findpage: page
      })
      this.loadMore()
    } else {
      let page = this.data.page + 1
      this.setData({
        page: page
      })
      this.loadMore()
    }
  },
  loadMore() {
    wx.showLoading({
      title: '团队加载中',
      icon: 'none',
      duration: 2000
    })
    if (this.data.inputvalue) {
      const url = "hxapi/api/Team/TeamList"
      const query = {
        highSchool: this.data.inputvalue,
        PageIndex: this.data.findpage
      }
      util.ReqSend(url, query).then((res) => {
        console.log(res)
        const data = JSON.parse(res.data)
        console.log(data)
        if (data.status == "1" && data.errorCode == "000") {
          if (data.data) {
            const getteam = data.data
            const all = this.data.showinfo.concat(getteam)
            this.setData({
              showinfo: all
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
            duration: 2000
          })
        }
      })
    } else {
      const url = "hxapi/api/Team/TeamList"
      const query = {
        highSchool: '',
        PageIndex: this.data.page
      }
      util.ReqSend(url, query).then((res) => {
        console.log(res)
        const data = JSON.parse(res.data)
        console.log(data)
        if (data.status == "1" && data.errorCode == "000") {
          if (data.data) {
            const getteam = data.data
            const all = this.data.showinfo.concat(getteam)
            this.setData({
              showinfo: all
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
      }).catch((err) => {
        wx.showToast({
          title: "请求错误",
          icon: 'none',
          duration: 2000
        })
      })
    }
    wx.hideLoading()
  },
  //防抖函数
  debounce:function (fun,delay){
    return function(url,query){
      let _this=this
      clearTimeout(fun.id)
      fun.id=setTimeout(function(){
        fun.call(_this,url,query)
      },delay)
    }
  },
  ReqSend: function (url,query){
      util.ReqSend(url,query).then(res=>{
        const data = JSON.parse(res.data)
        console.log(data)
        if (this.data.inputvalue) {
          if (data.data) {
            const getteam = data.data
            this.setData({
              showinfo: getteam
            })
          } else {
            wx.showLoading({
              title: '没有更多',
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
          }
        } else {
          this.setData({
            showinfo: []
          })
          this.loadMore()
        }
      })
  },
  bindinput: function (e) {
    console.log(e)
    this.setData({
      inputvalue: e.detail.value,
      findpage: 1,
      page: 1
    })
    const url='hxapi/api/Team/TeamList'
    //query为空时自动返回 20个数据
    const query={
      pageIndex: this.data.findpage,
      highSchool: this.data.inputvalue,
    }
    var debounceReq=this.debounce(this.ReqSend,500)
    debounceReq(url,query)
  },
  enterinfo(e) {
    console.log(e)
    wx.navigateTo({
      url: './teamInfo/teamInfo?info=' + JSON.stringify(e.currentTarget.dataset.info)
    })
  },
  add(e) {
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
      wx.showModal({
        title: '加入团队',
        content: '请确认加入此团队',
        confirmText: '确认加入',
        confirmColor: '#7b85fe',
        cancelText: '取消加入',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加入团队中',
              icon: 'none',
              duration: 2000
            })
            wx.getStorage({
              key: 'stuNo',
              success: function (res) {
                console.log(res)
                const url = 'hxapi/api/Team/TeamMemberAdd'
                const query = {
                  LeaderStuNo: e.currentTarget.dataset.teamleaderstuno ,
                  teamMemberStuNo: res.data,
                  teamID: e.currentTarget.dataset.teamid
                }
                util.ReqSend(url, query).then((res) => {
                  const data = JSON.parse(res.data)
                  console.log(data)
                  if (data.status == "1" && data.errorCode == "000") {
                    wx.showToast({
                      title: "成功加入",
                      icon: 'none',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: '加入失败'+data.errorInfo,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }).catch((err) => {
                  wx.showToast({
                    title: "请求错误",
                    icon: 'none',
                    duration: 2000
                  })
                })
              }
            })
          }
        }
      })
    }
  },
  entercreate() {
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
    }else{
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          const openID = res.data
          if (!app.globalData.stuNo) {
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
          } else if (app.globalData.stuNo) {
            const url = 'hxapi/api/Team/MyTeamInfo'
            const query = {
              openID: openID
            }
            util.ReqSend(url, query).then((res) => {
              console.log(res)
              const data = JSON.parse(res.data)
              console.log(data)
              if (data.status == "1" && data.errorCode == "000") {
                wx.navigateTo({
                  url: '/pages/team/teamInfo/teamInfo?info=' + JSON.stringify(data)
                })
              } else {
                wx.navigateTo({
                  url: '/pages/team/create/create',
                })
              }
            })
          }
        },
        fail: function () {
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
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showinfo: [],
      allschoolname: [],
      page: 1,
      findpage: 1,
      inputvalue: ''
    })
    wx.stopPullDownRefresh()
    this.loadMore()
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
    this.onLoad();
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