<template>
  <div class="detail-wrapper">
    <BookInfo :info='info'></BookInfo>
    <CommentList :comments="comments"></CommentList>
    <div class="comment" v-if="showAdd">
      <textarea v-model='comment'
                class='textarea'
                :maxlength='100'
                placeholder='请输入图书短评'>
      </textarea>
      <div class='location'>
        地理位置：
        <switch color='#EA5A49' :checked='location' @change='getGeo'></switch>
        <span class='text-primary'>{{location}}</span>
      </div>
      <div class='phone'>
        手机型号：
        <switch color='#EA5A49' :checked='phone' @change='getPhone'></switch>
        <span class='text-primary'>{{phone}}</span>
      </div>
      <button class="btn" @click='handleClickAddComment'>
        评论
      </button>
    </div>
    <div v-else class='text-footer'>
      未登录或者已经评论过啦~
    </div>
    <button open-type='share' class="btn">转发给好友</button>
  </div>
</template>

<script>

  import {get, post, getLocation, getCity, showModal} from '../../util'
  import BookInfo from '../../components/BookInfo'
  import CommentList from '../../components/CommentList'

  export default {
    components: {BookInfo, CommentList},
    data() {
      return {
        userinfo: {},
        comments: [],
        bookid: '',
        info: {},
        comment: '',
        location: '',
        phone: '',
      }
    },
    computed: {
      showAdd() {
        // 没登录
        if (!this.userinfo.openId) {
          return false
        }
        // 评论页面里查到有自己的openid
        if (this.comments.filter(v => v.openid === this.userinfo.openId).length) {
          return false
        }
        return true
      }
    },
    methods: {
      async getDetail() {
        let info
        try {
          info = this.info = await get('/weapp/bookdetail', {id: this.bookid})
        } catch (e) {
          console.log(e)
        }
        // 动态设置当前页面的标题。
        wx.setNavigationBarTitle({
          title: info.title
        })
      },
      async getCommentList() { // 获取评论列表
        const comments = await get('/weapp/commentlist', {bookid: this.bookid})
        this.comments = comments.list || []
      },
      async getGeo(e) {
        if (!e.target.value) { // 没选中
          this.location = ''
          return false
        }
        // FghcGZMt9CaIxldxCo4ryZTBGqVl1goc 百度地图API
        // http://api.map.baidu.com/geocoder/v2/ 百度地图url
        const ak = 'FghcGZMt9CaIxldxCo4ryZTBGqVl1goc'
        let url = 'http://api.map.baidu.com/geocoder/v2/'
        let {latitude, longitude} = await getLocation()
        let location = ''
        try {
          let data = await getCity(url, ak, `${latitude},${longitude}`)
          location = data.result.addressComponent.city
        } catch (err) {
          location = err
        } finally {
          this.location = location
        }
      },
      getPhone(e) {
        if (e.target.value) {
          const phoneInfo = wx.getSystemInfoSync()
          this.phone = phoneInfo.model
        } else {
          // 没选中
          this.phone = ''
        }
      },
      async handleClickAddComment(e) {
        if (!this.comment) {
          return false
        }
        // 评论内容 手机型号  地理位置 图书id 用户的openid
        const data = {
          openid: this.userinfo.openId,
          bookid: this.bookid,
          comment: this.comment,
          phone: this.phone,
          location: this.location
        }
        try {
          await post('/weapp/addcomment', data)
          this.comment = ''
          this.getCommentList()
        } catch (e) {
          showModal('失败', e.msg)
        }
      }
    }
    ,
    mounted() {
      // mpvue方法获取路由参数
      this.bookid = this.$root.$mp.query.id
      const userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        this.userinfo = userinfo
        this.getDetail()
        this.getCommentList()
      }
    }
  }
</script>
<style lang='scss'>
  @import "../../loader";

  .comment {
    margin-top: 10px;
    .textarea {
      background: #eee;
      width: rpx(730);
      height: rpx(200);
      padding: rpx(10);
    }
    .location {
      margin-top: 10px;
      padding: 5px 10px;
    }
    .phone {
      margin-top: 10px;
      padding: 5px 10px;

    }
  }
</style>

