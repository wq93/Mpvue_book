<template>
  <div class='bookinfo'>
    <div class="thumb">
      <img class='back'
           :src="info.image"
           mode='aspectFill'>
      <!--aspectFit保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来-->
      <img class="img"
           :src="info.image"
           mode='aspectFit'
      >
      <div class="info">
        <div class="title">
          {{info.title}}
        </div>
        <div class="author">
          {{info.author}}
        </div>
      </div>
    </div>
    <div class="detail">
      <!--添加人-->
      <img :src="userinfo.image" class='avatar' mode='aspectFit'>
      {{userinfo.name}}
      <div class="right text-primary">
        {{info.rate}}分
        <Rate :value='info.rate'></Rate>
      </div>
    </div>
    <div class="detail">
      {{info.publisher}}
      <div class="right">
        {{info.price}}
      </div>
    </div>
    <div class="tags">
      <div class="badge" :key='tag' v-for='tag in info.tags'>{{tag}}</div>
    </div>
    <div class="summary">
      <p :key='i' v-for='(sum,i) in info.summary'>{{sum}}</p>
    </div>
  </div>
</template>

<script>
  import Rate from '@/components/Rate'

  export default {
    components: {
      Rate
    },
    props: ['info'],
    computed: {
      userinfo() {
        return this.info.user_info || {}
      }
    }
  }
</script>

<style lang='scss'>
  @import "../loader";

  .bookinfo {
    font-size: 14px;

    .badge {
      display: inline-block;
      margin: 5px;
      padding: 5px;
      border-radius: 10px;
      border: 1px #EA5A49 solid;
      color: #EA5A49;
    }
    .summary {
      padding: 0 15px;
      margin-top: 10px;
      p {
        text-indent: 2em;
        font-size: 14px;
      }
    }
    .right {
      float: right;
    }
    .detail {
      padding: 5px 10px;
      .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    .thumb {
      width: rpx(750);
      height: rpx(500);
      overflow: hidden;
      position: relative;
      .back {
        // 放大15倍
        filter: blur(15px);
        width: 100%;
      }
      .img {
        position: absolute;
        width: 100%;
        height: rpx(300);
        left: 0;
        top: rpx(30);
      }
      .info {
        color: white;
        position: absolute;
        width: 100%;
        left: 0;
        top: rpx(330);
        text-align: center;
        .title {
          font-size: 20px;
        }
        .author {
          font-size: 14px;
        }

      }
    }
  }
</style>


