<template>
  <div class='swiper'>
    <swiper
      :indicator-dots='true'
      indicator-color='#EA5A49'
      :autoplay='true'
      :interval='6000'
      :duration='1000'
      :circular='true'
    >
      <div :key='imgindex' v-for='(top,imgindex) in imgUrls'>
        <swiper-item>
          <img
            @click='bookDetail(img)'
            class='slide-image'
            mode='aspectFit'
            v-for='img in top'
            :key='img.id'
            :src="img.image"
          >
        </swiper-item>
      </div>

    </swiper>
  </div>
</template>

<script>
  export default {
    props: ['tops'],
    computed: {
      imgUrls() {
        // 如果通用 请用chunk函数  比如lodash的chunk方法
        let res = this.tops
        // 序列化成一个二维数组
        return [res.slice(0, 3), res.slice(3, 6), res.slice(6)]
      }
    },
    methods: {
      bookDetail(item) {
        // 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
        wx.navigateTo({
          url: '/pages/detail/main?id=' + item.id
        })
      }
    }

  }
</script>
<style lang='scss'>
  @import "../loader";

  .swiper {
    margin-top: 5px;
    .slide-image {
      width: 33%;
      height: rpx(250);
    }
  }
</style>

