const Router = require("koa-router");
const router = new Router({ prefix: "/users" });

// /users
router.get("/", ctx => {
  ctx.body = "users";
});

module.exports = router;
