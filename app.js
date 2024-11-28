//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.baseUrl = 'https://hx.sisu.edu.cn/hxapi/api'
    //获取token  
    //利用token获取openiD
    wx.request({
      url: 'https://hx.sisu.edu.cn/hxapi/token',
      method: 'POST',
      data: {
        grant_type: 'password',
        username: 'HLS001',
        password: '078f1061-b036-46a8-b389-07b687ea1888'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data)
        const token = res.data.access_token
        this.globalData.token = token
        wx.login({ //login不能使用官方weixin接口，
          success: (res) => {
            console.log(res)
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              wx.request({
                url: this.baseUrl + '/stuBouding/GetOpenID',
                data: {
                  code: res.code,
                  grant_type: 'authorization_code'
                },
                method: "POST",
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Bearer ' + token
                },
                success: (res) => {
                  console.log("openidData",res)
                  const data = JSON.parse(res.data)
                  console.log(data)
                  if (data.status == "1" && data.errorCode == "000") {
                    const openid = data.openid
                    wx.getStorage({
                      key: 'stuNo',
                      success: function (res) {
                        console.log(res)
                      },
                      fail: (res) => {
                        console.log(res)
                        wx.request({
                          url: this.baseUrl + '/StuBouding/getStuNo',
                          data: {
                            openID: openid
                          },
                          method: "POST",
                          header: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + this.globalData.token
                          },
                          success: (res) => {
                            console.log(res)
                            const data = JSON.parse(res.data)
                            if (data.status == "1" && data.errorCode == "000") {
                              this.globalData.stuNo = data.stuNo
                              wx.setStorage({
                                data: data.stuNo,
                                key: 'stuNo',
                              })
                            } else {}
                          },
                          fail: (err) => {
                            console.log(err)
                          }
                        })
                      }
                    })
                    //存储openID
                    wx.setStorage({
                      key: 'openid',
                      data: openid
                    })
                  } else {
                    wx.showToast({
                      title: 'openID获取失败',
                      icon: "none",
                      duration: 2000
                    })
                  }
                },
                fail: (err) => {
                  wx.showToast({
                    title: 'openID获取失败',
                    icon: "none",
                    duration: 2000
                  })
                  console.log(err)
                }
              })
            }
          }
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '登录失败',
          icon: "none",
          duration: 2000
        })
        console.log(res)
      }
    })

    //获取用户信息
    wx.getSetting({
      success: (res) => {
        console.log("getSetting",res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: (res) => {
              console.log("res.userInfo",res.userInfo)
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getStorage({
      key: 'stuNo',
      success: (res) => {
        console.log(res)
        this.globalData.stuNo = res.data
      },
    })

  },
  globalData: {
    userInfo: null,
    token: '',
    myinfo: null,
    myteam: null,
    stuNo: null,
  }
})