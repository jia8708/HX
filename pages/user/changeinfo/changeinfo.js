// pages/user/register/register.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    names: {
      name: "姓名",
      schoolID: "学号",
      IDcard: "身份证号码",
      phone: "手机号码",
    },
    myinfo: null,
    name: '',
    schoolID: '',
    IDcard: '',
    phone: '',

    // date: '2016-09-01',
    // time: '12:01',
    // region: ['重庆市', '', '']
  },
  change: function () {
    const token = app.globalData.token
    for (let key in this.data.names) {
      if (!this.data[key]) {
        wx.showToast({
          title: "请重新输入" + this.data.names[key] + "信息",
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    //修改报名信息

  },
  submit: function () {
    console.log(app.globalData.token)
    const token = app.globalData.token
    for (let key in this.data.names) {
      if (!this.data[key]) {
        wx.showToast({
          title: "请重新输入" + this.data.names[key] + "信息",
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    //修改报名信息
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        console.log(res)
        wx.showLoading({
          title: '',
        })
        const url='hxapi/api/StuBouding/StuInfoBoudingUpdate'
        const query={
          stuNo: this.data.schoolID,
          stuName: this.data.name,
          stuID: this.data.IDcard,
          stuTelNo: this.data.phone,
          openID: res.data
        }
        util.ReqSend(url,query).then(res=>{
          console.log(res)
          const data = JSON.parse(res.data)
          console.log(data)
          if (data.status == "1" && data.errorCode == "000") {
            const myinfo = {
              stuName: this.data.name,
              stuID: this.data.IDcard,
              stuTelNo: this.data.phone,
              StuNo: this.data.schoolID
            }
            this.setData({
              myinfo: myinfo
            })
            //全局我的信息
            app.globalData.stuNo = myinfo.StuNo
            //存学号            
            wx.setStorage({
              key: 'stuNo',
              data: myinfo.StuNo
            })
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/user/user',
              })
            }, 2000)
          } else {
            wx.showToast({
              title: data.errorInfo,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  bindinput: function (e) {
    console.log(e);
    switch (e.target.dataset.model) {
      case "name":
        var standard = /^[\u4e00-\u9fa5]{0,}$/
        if (!standard.test(e.detail.value)) break;
        else {
          this.setData({
            name: e.detail.value
          })
        }
        break;
      case "schoolID":
        var standard = /[0-9]{10}/;
        if (!standard.test(e.detail.value)) break;
        else {
          this.setData({
            schoolID: e.detail.value
          })
        }
        break;
      case "IDcard":
        var standard = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
        if (!standard.test(e.detail.value)) {

        } else {
          this.setData({
            IDcard: e.detail.value
          })
        }
        break;
      case "phone":
        var standard = /^1[3456789]\d{9}$/;
        if (!standard.test(e.detail.value)) break;
        else {
          this.setData({
            phone: e.detail.value
          })
        }
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.info)
    // console.log(JSON.parse(options.info))
    const info = JSON.parse(options.info)
    //存 为了页面渲染
    this.setData({
      myinfo: info
    })

    //返回input 值  这里注意有大小写
    this.setData({
      schoolID: info.StuNo,
      name: info.stuName,
      IDcard: info.stuID,
      phone: info.stuTelNo
    })
    wx.stopPullDownRefresh()
    wx.showModal({
      title: '确认修改信息',
      content: '请在此页重新填写个人信息',
      confirmText: '确认',
      confirmColor: '#7b85fe',
      cancelText: '返回',
      success(res) {
        if (res.confirm) {
          console.log(options)
        } else if (res.cancel) {
          wx.navigateBack({

          })
        }
      }
    })

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
    this.onLoad()
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