const {mysql} = require('../qcloud')
module.exports = async (ctx) => {
  const {id} = ctx.request.query

  const detail = await mysql('books')
    .select('books.*', 'cSessionInfo.user_info')
    .join('cSessionInfo', 'books.openid', 'cSessionInfo.open_id')//books.openid'等于cSessionInfo.open_id 时查csessioninfo表的user_info字段
    .where('id', id)
    .first()

  const info = JSON.parse(detail.user_info)
  ctx.state.data = Object.assign({}, detail, {
    tags: detail.tags.split(','),
    summary: detail.summary.split('\n'),
    user_info: {
      name: info.nickName,
      image: info.avatarUrl
    }
  })

  // 点击量+1
  await mysql('books')
    .where('id', id) // 查找字段id
    .increment('count', 1) // 字段+1
}
