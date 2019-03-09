const vip = require('../models/vip')

let vipCourses;

module.exports = async (ctx,next)=>{
    // 做事情
    if (!vipCourses) {
        vipCourses = await vip.find()
    }
    ctx.state.vipCourses = vipCourses;

    // 下一步
    await next()
}