const Router = require('koa-router');
const { query } = require('../../utils/query')
const { INSERT_TABLE } = require('../../utils/sql')
const { getRandomSalt, getEncrypt } = require('../../utils/encrypt')
const { generateToken } = require('../../utils/token')

const router = new Router();
router.post('/register', async (ctx) => {
  const { username, password, phone, email } = ctx.request.body
  const responseBody = {
    code: 0,
    data: {}
  }

  try {
    const { insertId: class_id } = await query(INSERT_TABLE('class_list'), { class_tag: 1 })
    const { insertId: user_id } = await query(INSERT_TABLE('user_info'), { username, phone, email, class_id });
    const salt = getRandomSalt()
    const encryptPassword = getEncrypt(password + salt)
    await query(INSERT_TABLE('user_password'), {
      user_id,
      password: encryptPassword,
      salt
    })
    responseBody.data.msg = '注册成功'
    responseBody.data.token = generateToken({ username, userId: user_id, classId: class_id })
    responseBody.code = 200
  } catch (e) {
    responseBody.data.msg = '用户名已存在'
    responseBody.code = 404
  } finally {
    ctx.response.status = responseBody.code
    ctx.response.body = responseBody
  }
})

module.exports = router