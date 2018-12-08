<template>
  <div v-if='!books.length'>
    <p>暂时还没添加过书，快去添加几本吧</p>
  </div>
  <div v-else class="book-wrapper">
    <TopSwiper :tops='tops' v-if="books.length>=9"></TopSwiper>
    <Card :key='book.id' v-for='book in books' :book='book'></Card>
    <p class='text-footer' v-if='!more'>
      没有更多数据
    </p>
  </div>
</template>

<script>

  import {get} from '../../util'
  import Card from '../../components/Card'
  import TopSwiper from '../../components/TopSwiper'

  export default {
    components: {
      Card, TopSwiper
    },
    name: "Books",
    data() {
      return {
        books: [],
        page: 0,
        more: true,
        tops: []
      }
    },
    onShow() {
      this.getBookList(true)
      this.getTop()
    },
    // 下拉刷新周期函数
    onPullDownRefresh() {
      this.getBookList(true)
      this.getTop()
    },
    // 上滑加载更多API
    onReachBottom() {
      if (!this.more) {
        // 没有更多了
        return false
      }
      this.page = this.page + 1
      this.getBookList()
    },
    methods: {
      async getBookList(init = false) {
        // 分页
        if (init) {
          this.page = 0
          this.more = true
        }
        // loadingBar Api
        wx.showNavigationBarLoading()
        const books = await get('/weapp/booklist', {page: this.page})
        if (books.list.length < 10 && this.page > 0) {
          this.more = false
        }
        if (init) {
          this.books = books.list
          wx.stopPullDownRefresh()
        } else {
          // 下拉刷新，不能直接覆盖books 而是累加
          this.books = this.books.concat(books.list)
        }
        // loadingBar Api
        wx.hideNavigationBarLoading()
      },
      async getTop() {
        const tops = await get('/weapp/top')
        this.tops = tops.list
      }
    }
  }

</script>

<style scoped>
  .book-wrapper {
    padding: 0 12px;
  }
</style>
