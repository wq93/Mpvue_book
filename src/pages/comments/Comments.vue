<template>
  <div class="comments-wrapper">
    <CommentList v-if='userinfo.openId'
                 type='user'
                 :comments="comments"></CommentList>
    <div v-if='userinfo.openId'>
      <div class="page-title">我的图书</div>
      <Card
        v-for='book in books'
        :key='book.id'
        :book='book'></Card>
      <div v-if='!books.length'>暂时还没添加过书，快去添加几本吧</div>
    </div>
  </div>
</template>

<script>
  import {get} from '../../util'
  import CommentList from '../../components/CommentList'
  import Card from '../../components/Card'

  export default {
    name: "Comments",
    components: {CommentList, Card},
    data() {
      return {
        comments: [],
        books: [],
        userinfo: {
          openId: ''
        }
      }
    },
    methods: {
      init() {
        wx.showNavigationBarLoading()
        this.getComments()
        this.getBooks()
        wx.hideNavigationBarLoading()
      },
      async getBooks() { // 获取图书列表
        const books = await get('/weapp/booklist', {
          openid: this.userinfo.openId
        })
        this.books = books.list
      },
      async getComments() { // 获取评论列表
        const comments = await get('/weapp/commentlist', {
          openid: this.userinfo.openId
        })
        this.comments = comments.list
      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      this.init()
      wx.stopPullDownRefresh()
    },
    // mounted生命周期加载过一次后再切别的tab页,不会再加载一次
    onShow() {
      if (!this.userinfo.openId) {
        let userinfo = wx.getStorageSync('userinfo')
        console.log(userinfo.openId)
        if (userinfo) {
          this.userinfo = userinfo
          this.init()
        }
      }
    }
  }
</script>

<style scoped>

</style>
