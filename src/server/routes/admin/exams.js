const Router = require('@koa/router');
const { query } = require('../../utils/query')
const { QUERY_TABLE, INSERT_TABLE, REPLACE_TABLE, UPDATE_TABLE } = require('../../utils/sql');
const { generateRandomCode } = require('../../utils/generateRandomCode')
const { getJWTPayload } = require('../../utils/token')

const router = new Router();
router.get('/exams', async (ctx) => {
  const responseData = []
  const responseBody = {
    code: 0,
    data: {}
  }
  try {
    const { authorization } = ctx.header
    const { classId } = getJWTPayload(authorization)
    const res = await query(QUERY_TABLE('exam_list', ['class_id', classId]));
    res.map((item, index) => {
      const { id, exam_name, exam_content, exam_type, exam_difficulty, exam_code, is_open, timing_mode, start_time, end_time, count_down, publish_date } = item
      const generateExamTime = (time) => {
        const examTime = new Date(time).toLocaleString()
        return examTime.substr(0, examTime.length - 3)
      }
      const examTime = timing_mode === 1
        ? '倒计时 ' + count_down.replace(/s/g, '秒').replace(/m/g, '分钟').replace(/h/g, '小时').replace(/d/g, '天')
        : generateExamTime(+start_time) + '<br/>至<br/>' + generateExamTime(+end_time)
      responseData[index] = {
        id,
        examName: exam_name,
        examContent: exam_content,
        examType: exam_type,
        examDifficulty: exam_difficulty,
        examTimingMode: timing_mode,
        isOpen: !!is_open,
        examTime,
        examCode: exam_code,
        publishDate: parseInt(publish_date)
      }
    })
    responseBody.code = 200
    responseBody.data = {
      examList: responseData,
      total: responseData.length
    }
  } catch (e) {
    responseBody.code = 404
    responseBody.data = {
      msg: '无考试信息'
    }
  } finally {
    ctx.response.status = responseBody.code
    ctx.response.body = responseBody
  }
})

router.get('/exams/:id', async (ctx) => {
  const { id: examId } = ctx.params
  const responseBody = {
    code: 0,
    data: {}
  }
  try {
    const res = await query(`SELECT * FROM exam_list where id = ${examId}`);
    const { id, exam_name, exam_content, exam_type, exam_difficulty, exam_code, is_open, timing_mode, start_time, end_time, count_down, topic_list } = res[0]
    responseBody.data = {
      id,
      examName: exam_name,
      examContent: exam_content,
      examType: exam_type,
      examDifficulty: exam_difficulty,
      examTimingMode: timing_mode,
      isOpen: !!is_open,
      startTime: parseInt(start_time),
      endTime: parseInt(end_time),
      countDown: count_down,
      examCode: exam_code,
      topicList: JSON.parse(topic_list)
    }
    responseBody.code = 200
  } catch (e) {
    responseBody.code = 404
    responseBody.data = {
      msg: '无考试信息'
    }
  } finally {
    ctx.response.status = responseBody.code
    ctx.response.body = responseBody
  }
})

router.post('/exams', async (ctx) => {
  const {
    examName,
    examContent,
    examType,
    examDifficulty,
    examTimingMode,
    examTime,
    topicList
  } = ctx.request.body
  const responseBody = {
    code: 0,
    data: {}
  }
  try {
    await query(INSERT_TABLE('exam_list'), {
      exam_name: examName,
      exam_content: examContent,
      exam_type: examType,
      exam_difficulty: examDifficulty,
      timing_mode: examTimingMode,
      start_time: examTimingMode === 1 ? 0 : examTime[0],
      end_time: examTimingMode === 1 ? 0 : examTime[1],
      count_down: examTimingMode === 1 ? examTime : 0,
      topic_list: JSON.stringify(topicList),
      publish_date: new Date().getTime(),
      exam_code: generateRandomCode()
    })
    responseBody.data.msg = '新增成功'
    responseBody.code = 200
  } catch (e) {
    responseBody.data.msg = '异常错误'
    responseBody.code = 500
  } finally {
    ctx.response.status = responseBody.code
    ctx.response.body = responseBody
  }
})

router.delete('/exams/:id', async (ctx) => {
  const id = ctx.params.id
  const responseBody = {
    code: 0,
    data: {}
  }
  try {
    await query(`DELETE FROM exam_list WHERE id = ${id}`)
    responseBody.data.msg = '删除成功'
    responseBody.code = 200
  } catch (e) {
    responseBody.data.msg = '无此考试'
    responseBody.code = 404
  } finally {
    ctx.response.status = responseBody.code
    ctx.response.body = responseBody
  }
})

router.delete('/exams', async (ctx) => {
  const deleteIdList = ctx.request.body
  const responseBody = {
    code: 0,
    data: {}
  }
  try {
    await Promise.all(deleteIdList.map(async (deleteId) => {
      await query(`DELETE FROM exam_list WHERE id = ${deleteId}`)
    }))
    responseBody.data.msg = '删除成功'
    responseBody.code = 200
  } catch (e) {
    responseBody.data.msg = '无此考试'
    responseBody.code = 404
  } finally {
    ctx.response.status = responseBody.code
    ctx.response.body = responseBody
  }
})

router.put('/exams/:id', async (ctx) => {
  const { id: examId } = ctx.params
  const {
    examName,
    examContent,
    examType,
    examDifficulty,
    examTimingMode,
    examTime,
    topicList,
    examCode,
    isOpen
  } = ctx.request.body
  const responseBody = {
    code: 0,
    data: {}
  }
  try {
    const res = await query(`SELECT publish_date FROM exam_list WHERE id = ${examId}`);
    const { publish_date } = res[0]
    await query(REPLACE_TABLE('exam_list'), {
      id: examId,
      exam_name: examName,
      exam_content: examContent,
      exam_type: examType,
      exam_difficulty: examDifficulty,
      timing_mode: examTimingMode,
      start_time: examTimingMode === 1 ? 0 : examTime[0],
      end_time: examTimingMode === 1 ? 0 : examTime[1],
      count_down: examTimingMode === 1 ? examTime : 0,
      publish_date,
      topic_list: JSON.stringify(topicList),
      exam_code: examCode,
      is_open: isOpen
    })
    responseBody.data.msg = '修改成功'
    responseBody.code = 200
  } catch (e) {
    console.log(e)
    responseBody.data.msg = '异常错误'
    responseBody.code = 500
  } finally {
    ctx.response.status = responseBody.code
    ctx.response.body = responseBody
  }
})

router.put('/exams/status/:id', async (ctx) => {
  const { id: examId } = ctx.params
  const responseBody = {
    code: 0,
    data: {}
  }
  try {
    const res = await query(`SELECT is_open from exam_list where id = ${examId}`)
    const { is_open } = res[0]
    const newStatus = is_open === 1 ? 0 : 1
    await query(UPDATE_TABLE('exam_list', { primaryKey: 'id', primaryValue: examId }, { key: 'is_open', value: newStatus }))
    responseBody.data.msg = '修改成功'
    responseBody.data.status = !!!newStatus
    responseBody.code = 200
  } catch (e) {
    console.log(e)
    responseBody.data.msg = '异常错误'
    responseBody.code = 500
  } finally {
    ctx.response.status = responseBody.code
    ctx.response.body = responseBody
  }
})

module.exports = router