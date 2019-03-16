module.exports = {
  index: async app => {
    const name = await app.$serv.user.getUser();
    app.ctx.body = "用户列表:" + name;
  },
  info: async app => {
    app.ctx.body = "用户详情";
  }
};
