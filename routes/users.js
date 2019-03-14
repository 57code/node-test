const Router = require("koa-router");
const router = new Router({ prefix: "/users" });

// 用户上传, 常见参数：limits、fileFilter、storage
const upload = require("koa-multer")({ dest: "./public/images" });
router.post("/upload", upload.single("file"), ctx => {
  // 获取上传文件信息
  ctx.req.file; // 上传文件信息
  ctx.req.body; // 其他表单数据
  // 入库
  ctx.body = "上传成功";
});

// /users
const users = [{ id: 1, name: "tom" }, { id: 2, name: "jerry" }];
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

// 表单校验
const bouncer = require("koa-bouncer");
router.post("/", ctx => {
  // 数据校验开始
  try {
    console.log(ctx.request.body);
    
    ctx
      .validateBody("uname")
      .required("要求提供用户名") // 只是要求有uname字段
      .isString() // 确保输入的是字符串或者可以转换为字符串
      .trim()
      .isLength(6, 16, "用户名长度为6~16位");

    ctx.validateBody('email')
      .optional()
      .isString()
      .trim()
      .isEmail('非法的邮箱格式')

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
    const { body: user } = ctx.request; // 请求body
    user.id = users.length + 1;
    users.push(user);
    ctx.body = { ok: 1 };
  } catch (error) {
    //校验异常特别判断
    if (error instanceof bouncer.ValidationError) {
      ctx.status = 400;
      ctx.body = '校验失败：'+error.message;
      return; 
    }
    throw error
  }
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

router.post("/login", ctx => {
  // 拿出请求参数
  const body = ctx.request.body;
  // 登录逻辑省略
  // ...
  console.log(body);

  // 登录成功
  ctx.session.userinfo = body.username;

  ctx.body = {
    ok: 1,
    message: "登录成功"
  };
});

router.post("/logout", async ctx => {
  delete ctx.session.userinfo;
  ctx.body = {
    ok: 1,
    message: "登出系统"
  };
});

// jsonwebtoken令牌生成模块
const jwt = require("jsonwebtoken");
// koa的jwt中间件，作用是认证令牌合法性
const jwtAuth = require("koa-jwt");
const secret = "it's a secret";

router.post("/login-token", async ctx => {
  const { body } = ctx.request;

  const userinfo = body.username;

  // 省略登录逻辑

  ctx.body = {
    message: "登录成功",
    user: userinfo,
    // 使用jwt模块签名一个令牌
    token: jwt.sign(
      // 签名只是防篡改
      {
        data: userinfo, // 由于签名不是加密，令牌中不要存放敏感数据
        exp: Math.floor(Date.now() / 1000) + 3600 // 过期时间1分钟
      },
      secret
    )
  };
});

router.get(
  "/getUser-token",
  jwtAuth({
    // 对传入令牌进行校验
    secret
  }),
  async ctx => {
    //获取session
    ctx.body = {
      message: "获取数据成功",
      userinfo: ctx.state.user.data
    };
  }
);

// 需要路由守卫
const auth = require("../middleware/auth");
router.get("/getUser", auth, async ctx => {
  ctx.body = {
    ok: 1,
    message: "获取数据成功",
    userinfo: ctx.session.userinfo
  };
});

// oauth
// 1. 需要去授权方申请开放登录
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

  // 接下来：可以签发token，也可以存放信息值session

  ctx.redirect("/hello.html");
});

module.exports = router;
