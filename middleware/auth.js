// 认证用户
module.exports = async (ctx, next) => {
  if (!ctx.session.userinfo) {
    //   未登录
    // ctx.status = 401;
    ctx.body = {
      ok: 0,
      message: "用户未登录"
    };
  } else {
    await next();
  }
};
