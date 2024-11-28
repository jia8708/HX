// pages/team/create/create.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TeamLeaderStuNo:'',
    TeamName:'',
    date: '请选择到访日期',
    // time: '12:01',
    regions: ['请选择省份','重庆', '四川', '贵州', '云南', '海南', '广东', '福建', '山东', '河南', '江西', '河北', '山西', '吉林', '辽宁','黑龙江','陕西','甘肃','青海','浙江','台湾','湖北','湖南','江苏','安徽','北京','上海','天津','内蒙古','新疆','广西','宁夏','西藏'],
    index:0,
    schoolname:"请选择到访学校"
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  enterschools:function(){
    if (this.data.index==0){
      wx.showToast({
        title: '请先选择到访省份',
        icon: 'none',
        duration:2000
      })
 
    }else{
      wx.navigateTo({
        url: '../schools/schools?province=' + this.data.regions[this.data.index]
      })
    }
    
  },
  bindinput:function(e){
    switch (e.target.dataset.model) {
      case "name":
          this.setData({
            TeamName: e.detail.value
          })
        break;
      case "num":
        var standard = /[0-9]{10}/;
        if (!standard.test(e.detail.value)) break;
        else {
          this.setData({
            TeamLeaderStuNo: e.detail.value
          })
        }
        break;
    }
  },
  sumbit: function() {
    if (!this.data.TeamLeaderStuNo) {
      wx.showToast({
        title: "请重新输入学号信息",
        icon: 'none',
        duration: 2000
      })
      return
    }
      wx.getStorage({
        key: 'openid',
        success:(res)=>{
          const url='hxapi/api/Team/TeamNew'
          const query={
            openID: res.data,
            TeamName: this.data.TeamName,
            province: this.data.regions[this.data.index],
            HighSchool: this.data.schoolname,
            StartDate: this.data.date
          }
          //插入数据
          util.ReqSend(url,query).then(res=>{
            console.log(res)
            const data = JSON.parse(res.data)
            console.log(data)
            if (data.status == "1" && data.errorCode == "000") {
              wx.showToast({
                title: '创建成功',
                icon: 'success',
                duration: 2000
              })
            wx.redirectTo({
              url: '../teamInfo/teamInfo?info=' + JSON.stringify(data)
            })
            } else {
              wx.showToast({
                title: data.errorInfo,
                icon: 'none',
                duration: 2000
              })
            }
          })
        },
      })
},

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function(options) {
  wx.stopPullDownRefresh()
    wx.getStorage({
      key: 'stuNo',
      success: (res) => {
        console.log(res.data);
        this.setData({
          TeamLeaderStuNo: res.data,
        })
      }
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