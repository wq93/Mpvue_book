<template>
  <div class="container">
    <div class="userinfo">
      <img :src="userinfo.avatarUrl" alt="">
      <p>{{userinfo.nickName}}</p></div>
    <YearProgress></YearProgress>
    <button v-if='userinfo.openId' @click='scanBook' class='btn'>添加图书</button>
    <button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">点击登录</button>
  </div>
</template>
<script>
  import qcloud from 'wafer2-client-sdk'
  import YearProgress from '../../components/YearProgress'
  import {showSuccess, showModal, post, get} from '../../util'
  import config from '../../config'

  export default {
    name: "Me",
    components: {
      YearProgress
    },
    data() {
      return {
        userinfo: {
          avatarUrl: '../../../static/img/unlogin.png',
          nickName: '点击登录',
          openId: ''
        }
      }
    },
    onShow() {
      let userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        this.userinfo = userinfo
      }
    },
    methods: {
      async addBook(isbn) {
        let params = {
          isbn,
          openid: this.userinfo.openId
        }
        const res = await post('/weapp/addbook', params)
        showModal('添加成功',`[${res.title}] 添加成功`)
      },
      scanBook() {
        wx.scanCode({
          success: (res) => {
            if (res.result) {
              this.addBook(res.result)
            }
          }
        })
      },
      getWxLogin: function ({encryptedData, iv, userinfo}) {
        const self = this
        wx.login({
          success: (loginResult) => {
            var loginParams = {code: loginResult.code, encryptedData: encryptedData, iv: iv}
            qcloud.setLoginUrl(config.loginUrl)
            qcloud.requestLogin({
              loginParams, success() { // 获取用户信息
                qcloud.request({
                  url: config.userUrl, login: true, success(userRes) {
                    showSuccess('登录成功')
                    wx.setStorageSync('userinfo', userRes.data.data)
                    self.userinfo = userRes.data.data
                  }
                })
              }, fail(error) {
                showModal('登录失败', error)
              }
            })
          }, fail: function (loginError) {
            showModal('登录失败', loginError)
          }
        })
      },
      login(e) {
        const self = this //
        wx.getSetting({
          success: function (res) {
            // console.log(res) // 是否授权信息
            // 授权信息里有用户信息
            if (res.authSetting['scope.userInfo']) {
              // 检查用户登录是否过期
              wx.checkSession({
                success: function () {
                  // 没过期 直接成功
                  showSuccess('登录成功')
                },
                fail: function () {
                  // 过期了 重新登录 先清楚登录的状态
                  qcloud.clearSession()
                  // 登录态已过期，需重新登录 // 登录需要的加密信息
                  // console.log(e) //buuton里面的用户信息
                  var options = {
                    encryptedData: e.mp.detail.encryptedData,
                    iv: e.mp.detail.iv,
                    userinfo: e.mp.detail.userInfo
                  }
                  self.getWxLogin(options)
                }
              })
            } else {
              showModal('用户未授权', e.mp.detail.errMsg)
            }
          }
        })
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../loader';

  .container {
    padding: 0 rpx(30);

  }

  .userinfo {
    margin-top: rpx(100);
    text-align: center;
    img {
      width: rpx(150);
      height: rpx(150);
      margin: rpx(20);
      border-radius: 50%;
    }
    button {
      background: transparent;
      border: 0px solid transparent;
    }
  }
</style>
