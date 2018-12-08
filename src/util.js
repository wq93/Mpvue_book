// 工具函数库
import config from './config'

// http get工具函数 获取数据
export function get(url, data) {
  let method = 'GET'
  return request(url, method, data)
}

export function post(url, data) {
  let method = 'POST'
  return request(url, method, data)
}

function request(url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      url: config.host + url,
      success: function (res) {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          showModal('失败', res.data.data.msg)
          reject(res.data)
        }
      }
    })
  })
}

export function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
        type: 'wgs84',
        success: ({latitude, longitude}) => {
          resolve({latitude, longitude})
        },
        fail: (error) => {
          reject(error)
        }
      }
    )
  })
}

export function getCity(url, ak, location, output = 'json') {

  let data = {ak, location, output}
  return new Promise((resolve, reject) => {
    wx.request({
      url, data,
      success: res => {
        if (res.data.status === 0) {
          resolve(res.data)
        } else {
          let error = '未知地点'
          reject({error})
        }
      }
    })
  })
}

export function showModal(title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}

export function showSuccess(text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}
