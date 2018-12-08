const {mysql} = require('../qcloud')
module.exports = async (ctx) => {
  let {page, openid} = ctx.request.query
  let size = 10
  // 连表查询
  const mysqlSelect = mysql('books')
    .select('books.*', 'cSessionInfo.user_info')
    .join('cSessionInfo', 'books.openid', 'cSessionInfo.open_id')
    .orderBy('books.id', 'desc')

  // const books = await mysql('books')
  //   .select('books.*', 'csessioninfo.user_info')
  //   .limit(size).offset(Number(page) * size)
  //   .join('cSessionInfo', 'books.openid', 'cSessionInfo.open_id') //books.openid'等于cSessionInfo.open_id 时查csessioninfo表的user_info字段
  //   .orderBy('books.count', 'desc') // 排序

  let books
  // 在'我的评论'模块中传入openid时只返回自己添加的图书列表
  if (openid) {
    // 根据opid过滤
    books = await mysqlSelect.where('books.openid', openid)
  } else {
    // 全部图书 分页
    books = await mysqlSelect.limit(size).offset(Number(page) * size)
  }
  ctx.state.data = {
    list: books.map(v => {
      const info = JSON.parse(v.user_info)
      return Object.assign({}, v, {
        user_info: {
          nickName: info.nickName
        }
      })
    })
  }
}
