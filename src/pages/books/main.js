import Vue from 'vue'
import Books from './Books'

const app = new Vue(Books)
app.$mount()

export default {
  config: {
    // 下拉刷新
    enablePullDownRefresh: true
  }
}
