const {mysql} = require('../qcloud')
module.exports = async (ctx) => {
  // const top = await mysql('books')
  //   .select('id','title','image','count')
  //   .orderBy('count','desc')
  //   .limit(9)
  // ctx.state.data = {
  //   list:top
  // }

  const top = await mysql('books')
    .select('id', 'title', 'image', 'count') //查询字段
    .orderBy('count', 'desc')  // count值倒序
    .limit(9) //条数

  ctx.state.data = {
    list: top
  }
}
