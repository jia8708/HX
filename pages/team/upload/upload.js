import Toast from 'tdesign-miniprogram/toast/index';
const base64ArrayBuffer = require('base64-arraybuffer');
const app = getApp();
Component({
  data: {
    imageFiles: [],
    docFiles:[],
    allitem:[],
    fileitem:[],
    imageitem:[],
    imagesrc:[],
    teamID:'',
    showdel:false,
    loading:false,
    gridConfig: {
      column: 4,
      width: 160,
      height: 160,
    },
    config: {
      count: 9,
    },
  },
  methods: {
    showDel(){
      const flag = this.data.showdel
      this.setData({
        showdel:!flag
      })
    },
    showSuccessToast() {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '提交成功',
        theme: 'success',
        direction: 'column',
      });
    },
    showErrorToast() {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '提交失败',
        theme: 'error',
        direction: 'column',
      });
    },
    getTeamid(){
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          const openID = res.data
          if (app.globalData.stuNo) {
            const url = 'hxapi/api/Team/MyTeamInfo'
            const query = {
              openID: openID
            }
            util.ReqSend(url, query).then((res) => {
              console.log(res)
              this.setData({
                teamID:JSON.parse(res.data)
              })
              console.log(data)
            })
          }
        },
        fail:(res)=>{
          console.log('获取失败',res)
        }
      })
    },
    handleSuccess(e) {
      const { files } = e.detail;
      console.log(files)
      this.setData({
        imageFiles: files,
      });
    },
    handleRemove(e) {
      const { index } = e.detail;
      const { imageFiles } = this.data;
      imageFiles.splice(index, 1);
      this.setData({
        imageFiles,
      });
    },
    handleClick(e) {
      console.log(e.detail.file);
    },
    choosefile(){
      wx.chooseMessageFile({
        count: 1,
        type:'file',
        success:(res)=>{
          const tempFilePath = res.tempFiles.map(item=>item.path);
          console.log(tempFilePath,"tempFilePath")
          this.setData({
            docFiles:tempFilePath
          })
        }
      })
    },
    fetchfile() {
      return new Promise((resolve, reject) => {
        let that = this;
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];
        wx.request({
          url: app.baseUrl + '/FileUpload/StuFileList',
          method: 'POST',
          data: '\r\n--XXX' +
            '\r\nContent-Disposition: form-data; name="stuNo"' +
            '\r\n' +
            '\r\n' +
            app.globalData.stuNo + 
            '\r\n--XXX',
          header: {
            'Authorization': 'Bearer ' + app.globalData.token,
            'content-type': 'multipart/form-data; boundary=XXX'
          },
          success: function(res) {
            console.log("获取数据成功", res);
            that.setData({
              allitem: res.data.data
            });
            that.setData({
              fileitem: that.data.allitem.filter(file => {
                const extension = file.filePath.split('.').pop().toLowerCase();
                return !imageExtensions.includes(extension);
              })
            });
            that.setData({
              imageitem: that.data.allitem.filter(file => {
                const extension = file.filePath.split('.').pop().toLowerCase();
                return imageExtensions.includes(extension);
              })
            });
            console.log(that.data.fileitem, that.data.imageitem);
            resolve();
          },
          fail: function(err) {
            console.error(err);
            reject(err);
          }
        });
      });
    },
    downloadItems() {
      let that = this;
      let existingImages = this.data.imagesrc.map(item => item.name); // 获取已下载图片的名称
      let newImageItems = this.data.imageitem.filter(item => {
        const name = item.filePath.substring(item.filePath.lastIndexOf('/') + 1);
        return !existingImages.includes(name); // 检查图片是否已经下载过
      });
    
      if (newImageItems.length > 0) {
        that.setData({
          loading:true
        })
        let promises = newImageItems.map(item => {
          return new Promise((resolve, reject) => {
            const name = item.filePath.substring(item.filePath.lastIndexOf('/') + 1);
            const urlWithQuery = `${app.baseUrl}/FileUpload/DownloadFile?fileName=${name}`;
            wx.request({
              url: urlWithQuery,
              method: 'GET',
              responseType: 'arraybuffer',
              header: {
                'Authorization': 'Bearer ' + app.globalData.token,
              },
              success: function(res) {
               let url ='data:image/*;base64,'+base64ArrayBuffer.encode(res.data);
                console.log(res, '图片下载');
                resolve({
                  name: name,
                  url: url
                });
              },
              fail: function(err) {
                console.error(err);
                reject(err);
              }
            });
          });
        });
        Promise.all(promises).then(results => {
          let updatedImageSrc = that.data.imagesrc.concat(results);
          that.setData({
            imagesrc: updatedImageSrc
          });
          console.log(that.data.imagesrc);
          that.setData({
            loading:false
          })
        }).catch(error => {
          console.error('下载失败', error);
        });
      } else {
        console.log('所有图片已下载，不再重复下载');
      }
    },
    onTabsClick(event) {
      let that = this
      if (event.detail.value == 1) {
        that.fetchfile()
          .then(() => {
            that.downloadItems();
          })
          .catch(err => {
            console.error('Error in fetchfile:', err);
          });
      }
    },
    delFunc(e){
      let that = this;
      let index, fileurl;
      const type = e.currentTarget.dataset.type; 
      if(type === "file"){
        index = 0;
        fileurl = this.data.fileitem[index].filePath;
      }else{
        index = e.currentTarget.dataset.index;
        fileurl = this.data.imageitem[index].filePath;
      }
      wx.request({
        url: app.baseUrl + '/FileUpload/StuFileDelete',
        method: 'POST',
        data:'\r\n--XXX' +
        '\r\nContent-Disposition: form-data; name="filePath"' +
        '\r\n' +
        '\r\n' +
        fileurl +
        '\r\n--XXX',
        header: {
          'Authorization': 'Bearer ' + app.globalData.token,
          'content-type':'multipart/form-data; boundary=XXX'
        },
        success: function(res) {
          console.log("删除成功",res);
          that.fetchfile();
          let indexToDelete = that.data.imagesrc.findIndex(item => item.name === fileurl.substring(fileurl.lastIndexOf('/') + 1));
          if (indexToDelete !== -1) {
            let updatedImageSrc = that.data.imagesrc.filter((item, index) => index !== indexToDelete);
            that.setData({
            imagesrc: updatedImageSrc
          });
        }
        },
        fail: function(err) {
          console.error(err);
        }
      });
    },
    uploadFilePromise(options) {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          ...options,
          success: (res) => {
            console.log('文件上传成功', res);
            resolve(res);
          },
          fail: (err) => {
            console.error('文件上传失败', err);
            reject(err);
          }
        });
      });
      
    }, 
    uploadImages(imageFiles) {
      let that = this;
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => that.uploadFilePromise({
          url: app.baseUrl + '/FileUpload/UploadFile',
          filePath: file.url,
          name: 'file',
          formData: {
            stuNo: app.globalData.stuNo
          },
          header: {
            'Authorization': 'Bearer ' + app.globalData.token
          }
        }));
        return Promise.all(uploadPromises);
      }
      return Promise.resolve();
    },
    uploadDocument(docFiles) {
      if(docFiles.length>0){
        console.log(docFiles[0])
        return this.uploadFilePromise({
          url: app.baseUrl + '/FileUpload/UploadFile',
          filePath: docFiles[0],
          name: 'file',
          formData: {
            stuNo: app.globalData.stuNo
          },
          header: {
            'Authorization': 'Bearer ' + app.globalData.token
          }
        });
      }
      return Promise.resolve();
    },
    handleUpload() {
      let that = this;
      that.uploadImages(this.data.imageFiles)
        .then(() => {
          return that.uploadDocument(this.data.docFiles);
        })
        .then(() => {
          console.log('所有文件上传成功');
          that.showSuccessToast();
          that.setData({
            imageFiles:[],
            docFiles:[]
          })
        })
        .catch(error => {
          console.error('文件上传失败', error);
          that.showErrorToast();
        });
        
    }
  },
});