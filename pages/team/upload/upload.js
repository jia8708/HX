import Toast from 'tdesign-miniprogram/toast/index';
const base64ArrayBuffer = require('base64-arraybuffer');
const app = getApp();
Component({
  data: {
    file4: [],
    file3:[],
    file2:[],
    file1:[],
    allitem:[],
    item1:[],
    item2:[],
    item3:[],
    item4:[],
    imagesrc4:[],
    imagesrc1:[],
    imagesrc2:[],
    showdel1:false,
    showdel2:false,
    showdel4:false,
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
    showDel1(){
      const flag = this.data.showdel1
      this.setData({
        showdel1:!flag
      })
    },
    showDel2(){
      const flag = this.data.showdel2
      this.setData({
        showdel2:!flag
      })
    },
    showDel4(){
      const flag = this.data.showdel4
      this.setData({
        showdel4:!flag
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
    showLoading() {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '开始上传文件',
        theme: 'loading',
        direction: 'column',
      });
    },
    handleSuccess(e) {
      const { files } = e.detail;
      const fileType = parseInt(e.currentTarget.dataset.type);
      switch(fileType){
        case 1:
          this.setData({
            file1: files,
          });
          break;
        case 2:
          this.setData({
            file2: files,
          });
          break;
        case 4:
          this.setData({
            file4: files,
          });
          break;
      }
      
    },
    handleRemove(e) {
      const { index } = e.detail;
      const fileType = parseInt(e.currentTarget.dataset.type);
      switch(fileType){
        case 1:
          const { file1 } = this.data;
          file1.splice(index, 1);
          this.setData({
            file1,
          });
          break;
        case 2:
          const { file2 } = this.data;
          file2.splice(index, 1);
          this.setData({
            file2,
          });
          break;
        case 4:
          const { file4 } = this.data;
          file4.splice(index, 1);
          this.setData({
            file4,
          });
          break;
      }
      
    },
    choosefile(){
      wx.chooseMessageFile({
        count: 1,
        type:'file',
        success:(res)=>{
          const tempFilePath = res.tempFiles.map(item=>item.path);
          console.log(tempFilePath,"tempFilePath")
          this.setData({
            file3:tempFilePath
          })
        }
      })
    },
    fetchfile() {
      return new Promise((resolve, reject) => {
        let that = this;
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
              item3: that.data.allitem.filter(file => {
                return file.fileType === 3;
              })
            });
            that.setData({
              item4: that.data.allitem.filter(file => {
                return file.fileType === 4;
              })
            });
            that.setData({
              item1: that.data.allitem.filter(file => {
                return file.fileType === 1;
              })
            });
            that.setData({
              item2: that.data.allitem.filter(file => {
                return file.fileType === 2;
              })
            });
            console.log(that.data.item1, that.data.item2,that.data.item3, that.data.item4);
            resolve();
          },
          fail: function(err) {
            console.error(err);
            reject(err);
          }
        });
      });
    },
    //fileType:4,imagesrcs:that.data.imagesrc4,items:that.data.item4
    downloadItem(fileType,imagesrcs,items){
      let that = this;
      let existingImages = imagesrcs.map(item => item.name); // 获取已下载图片的名称
      let newImageItems = items.filter(item => {
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
                  url: url,
                  fileType:fileType
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
          let updatedImageSrc = imagesrcs.concat(results);
          const fileType = updatedImageSrc[0].fileType
          switch(fileType){
            case 1:
              that.setData({
                imagesrc1: updatedImageSrc
              });
              break;
              case 2:
                that.setData({
                  imagesrc2: updatedImageSrc
                });
                break;
              case 4:
                that.setData({
                    imagesrc4: updatedImageSrc
                  });
                break;

          }
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
    downloadItems() {
      this.downloadItem(1,this.data.imagesrc1,this.data.item1)
      this.downloadItem(2,this.data.imagesrc2,this.data.item2)
      this.downloadItem(4,this.data.imagesrc4,this.data.item4)
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
    //e,fileType:4,items:this.data.item4,imagesrcs:this.data.imagesrc4
    delItem(e,fileType,items,imagesrcs){
      let index;
      let that = this;
      if(fileType === 3) 
        index = 0;
      else{
        index = e.currentTarget.dataset.index;
      }
      const fileurl = items[index].filePath;
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
          let indexToDelete = imagesrcs.findIndex(item => item.name === fileurl.substring(fileurl.lastIndexOf('/') + 1));
          if (indexToDelete !== -1) {
            let updatedImageSrc = imagesrcs.filter((item, index) => index !== indexToDelete);
            switch(fileType){
              case 1:
                that.setData({
                  imagesrc1: updatedImageSrc
                });
                break;
              case 2:
                that.setData({
                  imagesrc2: updatedImageSrc
                });
                break;
              case 4:
                that.setData({
                  imagesrc4: updatedImageSrc
                });
                break;
            }
        }
        
        },
        fail: function(err) {
          console.error(err);
        }
      });
    },
    delFunc(e){
      const fileType = parseInt(e.currentTarget.dataset.type);
      switch(fileType){
        case 1:
          this.delItem(e,1,this.data.item1,this.data.imagesrc1);
          break;
        case 2:
          this.delItem(e,2,this.data.item2,this.data.imagesrc2);
          break;
        case 3:
          this.delItem(e,3,this.data.item3,[]);
          break;
        case 4:
          this.delItem(e,4,this.data.item4,this.data.imagesrc4);
          break;
      }
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
    uploadImages(files,fileType) {
      let that = this;
      if (files.length > 0) {
        const uploadPromises = files.map(file => that.uploadFilePromise({
          url: app.baseUrl + '/FileUpload/UploadFile',
          filePath: file.url,
          name: 'file',
          formData: {
            stuNo: app.globalData.stuNo,
            fileType:fileType
          },
          header: {
            'Authorization': 'Bearer ' + app.globalData.token
          }
        }));
        return Promise.all(uploadPromises);
      }
      return Promise.resolve();
    },
    uploadDocument(files) {
      if(files.length>0){
        console.log(files[files.length-1])
        return this.uploadFilePromise({
          url: app.baseUrl + '/FileUpload/UploadFile',
          filePath: files[files.length-1],
          name: 'file',
          formData: {
            stuNo: app.globalData.stuNo,
            fileType:"3"
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
      this.showLoading();
      
      that.uploadImages(this.data.file4,'4')
        .then(()=>{
          return that.uploadImages(this.data.file1,'1')
        })
        .then(()=>{
          return that.uploadImages(this.data.file2,'2')
        })
        .then(() => {
          return that.uploadDocument(this.data.file3);
        })
        .then(() => {
          console.log('所有文件上传成功');
          that.showSuccessToast();
          that.setData({
            file4:[],
            file3:[],
            file1:[],
            file2:[]
          })
        })
        .catch(error => {
          console.error('文件上传失败', error);
          that.showErrorToast();
        });
        
    }
  },
});