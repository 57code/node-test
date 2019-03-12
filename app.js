const Koa = require("koa");
const static = require("koa-static");
const app = new Koa();

// 数据库连接
const mongoose = require("./models/mongoose");

// 引入模板引擎
const hbs = require("koa-hbs");
const helpers = require("./utils/helpers");
app.use(
  hbs.middleware({
    viewPath: __dirname + "/views", //视图根目录
    defaultLayout: "layout", //默认布局页面
    partialsPath: __dirname + "/views/partials", //注册partial目录
    disableCache: true //开发阶段不缓存
  })
);

// 导入路由文件
const index = require("./routes/index");
const users = require("./routes/users");
const api = require("./routes/api");
const students = require("./routes/students");

// 中间件框架
// 中间件是一个异步函数，对用户请求和响应做预处理
const bouncer = require("koa-bouncer");
// 错误处理中间件写在最上面
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // 系统日志

    // 给用户显示信息
    ctx.status = error.statusCode || error.status || 500;
    // ctx.type = "json";

    if (error instanceof bouncer.ValidationError) {
      ctx.body = '校验失败：'+error.message;
      return; 
    }

    ctx.type = "text";
    if (error.expose) {
      console.log("-------error.expose=true---------");
      // ctx.body = error.message;
      ctx.body = error.stack;
    } else {
      console.log("-------error.expose=false---------");

      ctx.body = error.stack;
    }

    // 全局错误处理
    ctx.app.emit("error", error);
  }
});

// 静态文件服务
app.use(static(__dirname + "/public"));

app.use(bouncer.middleware());

const bodyparser = require("koa-bodyparser");
app.use(bodyparser());

const session = require("koa-session");
const redisStore = require("koa-redis");
const redis = require("redis");
const client = redis.createClient(6379, "localhost");
app.keys = ["some secret", "another secret"];
app.use(
  session(
    {
      key: "kkb:sess",
      store: redisStore({ client })
    },
    app
  )
);
// app.use(ctx => {
//   if (ctx.path === '/favicon.ico') return;
//   // 获取
//   let n = ctx.session.count || 0;
//   // 设置
//   ctx.session.count = ++n;
//   ctx.body = '第' + n + '次访问';
//   //查看数据
//   client.keys('*',(err,keys)=>{
//     console.log(keys);
//     keys.forEach(key=>{
//       client.get(key,(err,val)=>{
//         console.log(val);
//       })
//     })
//   })
// });
// vip课程查询中间件
app.use(require("./middleware/get-vip"));

app.use(async (ctx, next) => {
  //请求操作
  await next();
  // 获取响应头，印证执行顺序
  const rt = ctx.response.get("X-Response-Time");
  console.log(`输出计时：${ctx.method} ${ctx.url} - ${rt}`);
});

// 响应时间统计中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log("开始计时");
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  console.log("计时结束");
});

//  app.use(async (ctx, next) => {
//     throw new Error("未知错误");
//   // 用户错误
// //   ctx.throw(401, "认证失败");
//     // 相当于
// //   const err = new Error("name required");
// //   err.status = 401;
// //   err.expose = true;
// //   throw err;
// });

// 响应用户请求
// app.use(ctx => {
//   console.log("响应用户请求");
//   ctx.status = 200; // 设置响应状态码
//   ctx.type = "html"; // 设置响应类型，等效于ctx.set('Content-Type','text/html')
//   ctx.body = "<h1>Hello Koa</h1>"; //设置响应体
// });

app.use(index.routes());
app.use(users.routes());
app.use(api.routes());
app.use(students.routes());

// 监听全局错误事件
app.on("error", err => {
  // console.error(err);
});

//开始监听端口，等同于http.createServer(app.callback()).listen(3000);
app.listen(3000);
