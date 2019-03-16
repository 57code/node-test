module.exports = {
  "get /": async app => {
    const name = await app.$serv.user.getUser();
    app.ctx.body = "kkb首页: " + name;
  },
  "get /detail": async app => {
    app.ctx.body = "kkb详情页";
  }
};
