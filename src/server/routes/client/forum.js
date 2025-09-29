const Router = require('@koa/router');
const { query } = require('../../utils/query');
const { QUERY_TABLE, INSERT_TABLE, UPDATE_TABLE, DELETE_TABLE } = require('../../utils/sql');
const parse = require('../../utils/parse')
const computeTimeAgo = require('../../utils/computeTimeAgo')

const router = new Router();
router.get('/forums', async (ctx) => {
  const response = []
  const res = await query(QUERY_TABLE('forum_list'));
  res.map((item, index) => {
    const { forum_id, forum_avatar, forum_author, publish_time, forum_image, forum_title, forum_content, forum_like, forum_comment } = item
    const timeAgo = computeTimeAgo(publish_time)
    const date = new Date(Number(publish_time))
    const publishTimeString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    response[index] = {
      forumId: forum_id,
      forumAvatar: forum_avatar,
      forumAuthor: forum_author,
      publishTime: publishTimeString,
      timeAgo,
      forumImage: forum_image,
      forumTitle: forum_title,
      forumContent: forum_content,
      forumLike: forum_like,
      forumComment: forum_comment
    }
  })
  ctx.response.body = parse(response);
})

router.get('/forums/:id', async (ctx) => {
  const id = ctx.params.id
  const res = await query(`SELECT * FROM forum_list WHERE forum_id = ${id}`)
  const isExist = res.length !== 0
  if (!isExist) {
    ctx.response.status = 404
    ctx.response.body = {
      error: 'forum is not existed'
    }
  }
  else {
    const { forum_id, forum_avatar, forum_author, publish_time, forum_image, forum_title, forum_content, forum_like, forum_comment } = parse(res)[0]
    const timeAgo = computeTimeAgo(publish_time)
    const date = new Date(Number(publish_time))
    const publishTimeString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    ctx.response.body = {
      forumId: forum_id,
      forumAvatar: forum_avatar,
      forumAuthor: forum_author,
      publishTime: publishTimeString,
      timeAgo,
      forumImage: forum_image,
      forumTitle: forum_title,
      forumContent: forum_content,
      forumLike: forum_like,
      forumComment: forum_comment
    }
  }
})

router.post('/forums', async (ctx) => {
  const forumAuthor = ctx.request.body.forumAuthor
  const res = await query("SELECT * FROM forum_list WHERE BINARY `forum_author` LIKE '%" + forumAuthor + "%'")
  const isExist = res.length !== 0
  if (!isExist) {
    ctx.response.status = 404
    ctx.response.body = {
      code: 404,
      errorMsg: 'forum is not existed'
    }
  }
  else {
    const response = []
    res.map((item, index) => {
      const { forum_id, forum_avatar, forum_author, publish_time, forum_image, forum_title, forum_content, forum_like, forum_comment } = item
      const timeAgo = computeTimeAgo(publish_time)
      const date = new Date(Number(publish_time))
      const publishTimeString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

      response[index] = {
        forumId: forum_id,
        forumAvatar: forum_avatar,
        forumAuthor: forum_author,
        publishTime: publishTimeString,
        timeAgo,
        forumImage: forum_image,
        forumTitle: forum_title,
        forumContent: forum_content,
        forumLike: forum_like,
        forumComment: forum_comment
      }
    })
    ctx.response.body = parse(response);
  }
})

router.put('/forums', async (ctx) => {
  const { forumAuthor, forumAvatar, forumTitle, forumContent } = ctx.request.body
  const data = {
    forum_author: forumAuthor,
    forum_avatar: forumAvatar,
    publish_time: new Date().getTime(),
    forum_image: 'http://cdn.algbb.cn/emoji/32.png',
    forum_title: forumTitle,
    forum_content: forumContent,
    forum_like: 0,
    forum_comment: 0
  }
  await query(INSERT_TABLE('forum_list'), data)
  ctx.response.body = {
    msg: '发布成功'
  }
})

router.put('/forums/:id', async (ctx) => {
  const id = ctx.params.id
  const { forumTitle, forumContent } = ctx.request.body
  await query(UPDATE_TABLE('forum_list', { primaryKey: 'forum_id', primaryValue: id }, { key: 'forum_title', value: forumTitle }))
  await query(UPDATE_TABLE('forum_list', { primaryKey: 'forum_id', primaryValue: id }, { key: 'forum_content', value: forumContent }))
  ctx.response.body = {
    msg: '修改成功'
  }
})

router.delete('/forums/:id', async (ctx) => {
  const { id } = ctx.params
  await query(DELETE_TABLE('forum_list', { primaryKey: 'forum_id', primaryValue: id }))
  ctx.response.body = {
    msg: '删除成功'
  }
})

module.exports = router