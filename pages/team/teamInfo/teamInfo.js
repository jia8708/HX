// pages/team/teamInfo/teamInfo.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teaminfo: null,
    teamID:'',
    captain:false,
    modalHidden: true,
    inputValue:'',
    addmember:'',
    mystuNo:'',
    myteam:'',
    showpicker:false,
    date: '请重新选择到访日期',
  },
    //弹出添加成员
    modalTap: function(e) {
      this.setData({
        modalHidden: false
      })
    },
    bindcancel:function(e){
      this.setData({
        modalHidden: true
      })
    },
  
  bindDateChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    const url='hxapi/api/Team/TeamTimeModi'
    const query={
      teamID: this.data.teamID,
        startDate: e.detail.value
    }
    util.ReqSend(url,query).then(res=>{
      console.log(res)
      const data = JSON.parse(res.data)
      console.log(data)
      if (data.status == "1" && data.errorCode == "000") {
        wx.showToast({
          title: "修改成功",
          icon: 'none',
          duration: 2000
        })
      this.setData({
        showpicker:false
      })
        this.getteaminfo()
      } else {
        wx.showToast({
          title: data.errorInfo,
          icon: 'none',
          duration: 4000
        })
      }
    })
  },
  changedate:function(e){
    console.log(this.data.teaminfo)
    wx.showModal({
      title: '修改时间',
      content: '修改到访学校时间',
      confirmText: '确认修改',
      confirmColor: '#7b85fe',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
           this.setData({
            showpicker:true
           })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  

  },
  addmember: function(e) {
    console.log(e.detail.value)
    this.setData({
        addmember: e.detail.value
    })
    // console.log(this.data.teaminfo.TeamID)
    //添加
 
 
  },
  //修改日期
  modalTap2: function (e) {
    this.setData({
      modalHidden2: false
    })
  },
  bindcancel2: function (e) {
    this.setData({
      modalHidden2: true
    })
  },
  //确定修改时间
  bindconfirm2: function (e) {
    const addmember = this.data.addmember
    var standard = /[0-9]{10}/;
    if (!standard.test(addmember)) {
      wx.showToast({
        title: '输入正确学号',
        icon: 'none',
        duration: 2000
      })
    }
    else if (addmember == this.data.teaminfo.TeamLeaderStuNo) {
      wx.showToast({
        title: '队长已在队伍中',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      const url='hxapi/api/Team/TeamMemberAdd'
      const query={
        LeaderStuNo: this.data.teaminfo.TeamLeaderStuNo,
        teamMemberStuNo: addmember,
        teamID: ""
      }
      util.ReqSend(url,query).then((res)=>{
        console.log(res)
        const data = JSON.parse(res.data)
        console.log(data)
        if (data.status == "1" && data.errorCode == "000") {
          wx.showToast({
            title: "成功加入",
            icon: 'none',
            duration: 2000
          })
          this.getteaminfo()
        } else {
          wx.showToast({
            title: data.errorInfo,
            icon: 'none',
            duration: 4000
          })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      })
    }
    this.setData({
      modalHidden: true
    })
  },
  //确定添加
  bindconfirm: function(e) {
    const addmember=this.data.addmember
    var standard = /[0-9]{10}/;
    if (!standard.test(addmember)) {
      wx.showToast({
        title: '输入正确学号',
        icon: 'none',
        duration: 2000
      })
    }
    else if (addmember == this.data.teaminfo.TeamLeaderStuNo) {
      wx.showToast({
        title: '队长已在队伍中',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      const url='hxapi/api/Team/TeamMemberAdd'
      const query={
        LeaderStuNo: this.data.teaminfo.TeamLeaderStuNo,
        teamMemberStuNo: addmember,
        teamID: ""
      }
      util.ReqSend(url,query).then(res=>{
        console.log(res)
        const data = JSON.parse(res.data)
        console.log(data)
        if (data.status == "1" && data.errorCode == "000") {
          wx.showToast({
            title: "成功加入",
            icon: 'none',
            duration: 2000
          })
          this.getteaminfo()
        } else {
          wx.showToast({
            title: "加入失败",
            icon: 'none',
            duration: 2000
          })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      })
      wx.request({
        url: app.baseUrl + '/Team/TeamMemberAdd',
        data: {
      
        },
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + app.globalData.token
        },
        success: (res) => {
        
        
        }
      })

    }
    this.setData({
      modalHidden: true
    })
  },
  //删除队员
  del: function(e) {
    console.log(e)
    wx.showModal({
      title: '删除队员',
      content: '这个队员将不在这个队伍',
      confirmText: '删除队员',
      confirmColor: '#7b85fe',
      cancelText: '取消',
      success:(res)=>{
       if(res.confirm){
         const url='hxapi/api/Team/TeamMemberDelete'
         const query= {
          teamMemberStuNo: e.target.dataset.id
        }
        util.ReqSend(url,query).then(res=>{
          console.log(res)
          const data = JSON.parse(res.data)
          console.log(data)
          if (data.status == "1" && data.errorCode == "000") {
            wx.showToast({
              title: "成功删除",
              icon: 'none',
              duration: 2000
            })
            this.getteaminfo()
            // this.setData({
            //   teaminfo: JSON.parse(res.data)
            // })
          } else {
            wx.showToast({
              title: data.errorInfo,
              icon: 'none',
              duration: 4000
            })
          }
        })
       }else if(res.cancel) {
        console.log('用户点击取消')
      }
      }
    })
  },
  delteam:function(e){
    wx.showModal({
      title: '解散队伍',
      content: '请确定要解散队伍，解散队伍后队伍信息将不存在',
      confirmText: '确认解散',
      confirmColor: '#7b85fe',
      cancelText: '取消',
      success:(res)=>{
        if (res.confirm) {
          wx.getStorage({
            key: 'openid',
            success: function (res) {
              const url='hxapi/api/team/teamDelete'
              const query={
                openID: res.data
              }
              util.ReqSend(url,query).then(res=>{
                console.log(res)
                const data = JSON.parse(res.data)
                console.log(data)
                if (data.status == "1" && data.errorCode == "000") {
                  wx.showToast({
                    title: '队伍成功解散',
                    icon:"success",
                    duration: 2000
                  })
                  wx.navigateBack({})
                } else {
                  wx.showToast({
                    title: data.errorInfo,
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
              wx.request({
                url: app.baseUrl+'/team/teamDelete',
                method: 'POST',
                data: {
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Bearer ' + app.globalData.token
                },
                success: (res) => {
                 
                }
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //获取队伍信息
  getteaminfo(){
    const url='hxapi/api/Team/TeamInfoGet'
    const query={
      teamID: this.data.teamID
    }
    util.ReqSend(url,query).then(res=>{
      console.log(res)
      const data = JSON.parse(res.data)
      console.log(data)
      if (data.status == "1" && data.errorCode == "000") {
        this.setData({
          teaminfo: data
        })
        //判断是否是我的队伍
        const teammember = data.teamMemberData
        console.log(teammember)
        if (!teammember){

        }else{
          let num = []
          console.log(teammember.length)
          for (let i = 0; i < teammember.length; i++) {
            num.push(teammember[i].MemberStuNo)
          }
          this.setData({
            myteam: num.includes(this.data.mystuNo)
          })
        }
        console.log(this.data.myteam)          
        //判断是否是队长
        if (app.globalData.stuNo == data.TeamLeaderStuNo) {
          this.setData({
            captain: true
          })
        }
      } else {
        wx.showToast({
          title: data.errorInfo,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideLoading()
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.getStorage({
        key: 'stuNo',
        success: (res)=>{
            this.setData({
              mystuNo:res.data
            })
        },
      })
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: "信息加载中"
    })
    //从团队主页面转入的参数
    console.log(options)
    if (options){
      const info = JSON.parse(options.info)
      console.log(info)
      if (info.teamID){
        this.setData({
          teamID: info.teamID
        })
      } else if (info.TeamID){
        this.setData({
          teamID: info.TeamID
        })
      }
   
    }


  
    
    this.getteaminfo()
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