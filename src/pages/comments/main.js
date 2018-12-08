import Vue from 'vue'
import Comments from './Comments'

const app = new Vue(Comments)
app.$mount()
export default {
  config: {
    // 下拉刷新
    enablePullDownRefresh: true,
    navigationBarTitleText: '评论列表',
  }
}
