const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function ReqSend(url,query){
  console.log(app)
  wx.showLoading({
    title: '加载中...',
  })
 return new Promise((reslove,reject)=>{
  wx.request({
    url: 'https://hx.sisu.edu.cn/'+url,
    data: query,
    method: 'POST',
    header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'bearer ' + app.globalData.token//'bearer 有空格'
     },
    success:function(res){
      console.log(res)
      wx.hideLoading()
      reslove(res)
    },
    fail:function(err){
      wx.showModal({
        title: 'Request Fail',
        content: '请求时间过长',
      });
      wx.hideLoading();
      reject(res)
    }
  })
 })

}

module.exports = {
  formatTime: formatTime,
  ReqSend:ReqSend
}
