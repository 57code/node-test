// 函数式路由
module.exports = app => ({
    "get /": app.$ctrl.user.index,
    "get /info": app.$ctrl.user.info,
})