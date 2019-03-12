const Router = require("koa-router");
const router = new Router({ prefix: "/users" });



// /users
const users = [{ id: 1, name: "tom" }, { id: 2, name: "jerry" }];
const bouncer = require("koa-bouncer");
router.get("/", ctx => {
  console.log("GET /users");
  const { name } = ctx.query; // ?name=xx
  let data = users;
  if (name) {
    data = users.filter(u => u.name === name);
  }
  ctx.body = { ok: 1, data };
});
router.get("/:id", ctx => {
  console.log("GET /users/:id");
  const { id } = ctx.params; // /users/1
  const data = users.find(u => u.id == id);
  ctx.body = { ok: 1, data };
});
router.post("/", ctx => {
  // try {
  // 校验开始
  ctx
    .validateBody("uname")
    .required("要求提供用户名")
    .isString()
    .trim()
    .isLength(6, 16, "用户名长度为6~16位");

  // ctx.validateBody('email')
  //   .optional()
  //   .isString()
  //   .trim()
  //   .isEmail('非法的邮箱格式')

  ctx
    .validateBody("pwd1")
    .required("密码为必填项")
    .isString()
    .isLength(6, 16, "密码必须为6~16位字符");

  ctx
    .validateBody("pwd2")
    .required("密码确认为必填项")
    .isString()
    .eq(ctx.vals.pwd1, "两次密码不一致");

  // 校验数据库是否存在相同值
  // ctx.validateBody('uname')
  //   .check(await db.findUserByUname(ctx.vals.uname), 'Username taken')
  ctx.validateBody("uname").check("jerry", "用户名已存在");

  // 如果走到这里校验通过

  // 校验器会用净化后的值填充 `ctx.vals` 对象
  console.log(ctx.vals);

  console.log("POST /users");
  // const { body: user } = ctx.request; // 请求body
  const user = ctx.vals;
  user.id = users.length + 1;
  users.push(user);
  ctx.body = { ok: 1 };
  // } catch (error) {
  //   if (error instanceof bouncer.ValidationError) {
  //     ctx.body = '校验失败：'+error.message;
  //     return;
  //   }
  //   throw error
  // }
});
router.put("/", ctx => {
  console.log("PUT /users");
  const { body: user } = ctx.request; // 请求body
  const idx = users.findIndex(u => u.id == user.id);
  if (idx > -1) {
    users[idx] = user;
  }
  ctx.body = { ok: 1 };
});
router.delete("/:id", ctx => {
  console.log("DELETE /users/:id");
  const { id } = ctx.params; // /users/1
  const idx = users.findIndex(u => u.id == id);
  if (idx > -1) {
    users.splice(idx, 1);
  }
  ctx.body = { ok: 1 };
});

router.post("/login", async ctx => {
  const { body } = ctx.request;
  console.log("body", body);

  //登录逻辑，略

  //登录成功，设置session
  ctx.session.userinfo = body.username;
  ctx.body = {
    ok: 1,
    message: "登录成功"
  };
});
router.post("/logout", async ctx => {
  //设置session
  delete ctx.session.userinfo;
  ctx.body = {
    ok: 1,
    message: "登出系统"
  };
});

router.get("/getUser", require("../middleware/auth"), async ctx => {
  const userinfo = ctx.session.userinfo;
  if (userinfo) {
    ctx.body = {
      ok: 1,
      message: "获取数据成功",
      userinfo: ctx.session.userinfo
    };
  } else {
    ctx.body = {
      ok: 0,
      message: "获取数据失败，用户未登录"
    };
  }
});

// token判断
const jwt = require("jsonwebtoken");
const jwtAuth = require("koa-jwt");
const secret = "it's a secret";
// app.use(jwtAuth({
//         secret,
//     })
//     .unless({
//         path: [/\/login/],
//     }))

router.post("/login-token", async ctx => {
  const { body } = ctx.request;
  //登录逻辑，略
  //设置session
  const userinfo = body.username;
  ctx.body = {
    message: "登录成功",
    user: userinfo,
    // 生成 token 返回给客户端
    token: jwt.sign(
      {
        data: userinfo,
        // 设置 token 过期时间，一小时后，秒为单位
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // 60 seconds * 60 minutes = 1 hour
      },
      secret
    )
  };
});

router.get(
  "/getUser-token",
  jwtAuth({
    secret
  }),
  async ctx => {
    // 验证通过，state.user
    console.log(ctx.state.user);

    //获取session
    ctx.body = {
      message: "获取数据成功",
      userinfo: ctx.state.user.data
    };
  }
);

const config = {
  client_id: "a141111525bac2f1edf2",
  client_secret: "8e37306c1451e60412754ace80edee4ca937564a"
};
const axios = require("axios");
const querystring = require("querystring");

router.get("/login-github", async ctx => {
  //重定向到认证接口,并配置参数
  const path = `https://github.com/login/oauth/authorize?client_id=${
    config.client_id
  }`;

  //转发到授权服务器
  ctx.redirect(path);
});
router.get("/oauth/github/callback", async ctx => {
  const code = ctx.query.code;
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code
  };
  let res = await axios.post(
    "https://github.com/login/oauth/access_token",
    params
  );
  console.log(res.data);

  const access_token = querystring.parse(res.data).access_token;
  res = await axios.get(
    "https://api.github.com/user?access_token=" + access_token
  );
  console.log("userAccess:", res.data);
  ctx.redirect("/hello.html");
});

const upload = require("koa-multer")({ dest: "./public/images" });
router.post("/upload", upload.single("file"), ctx => {
  console.log(ctx.req.file); // 注意数据存储在原始请求中
  console.log(ctx.req.body); // 注意数据存储在原始请求中
  ctx.body = "上传成功";
});

module.exports = router;
