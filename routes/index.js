const Router = require("koa-router");
const router = new Router();

router.get("/", async ctx => {
  //   ctx.body = "index";

  let showVideo;
  // cookie中查询一周内是否看过视频
  if (ctx.cookies.get('isPlayed')) {
    showVideo = false;
  }else{
    showVideo = true;
    ctx.cookies.set('isPlayed', true, {maxAge: 7*24*3600000})
  }

  // 渲染页面
  await ctx.render("index", {
    title: "用户列表",
    subTitle: "handlebars语法",
    isShow: true,
    username: "jerry",
    showVideo: showVideo,
    users: [
        { username: "tom", age: 20, birthday:new Date(1999,2,2) }, 
        { username: "jerry", age: 20, birthday:new Date(1999,3,2) }]
  });

});

module.exports = router;
