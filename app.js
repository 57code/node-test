const Koa = require("koa");
const static = require('koa-static')
const session = require('koa-session')
const redisStore = require('koa-redis'); // 整合redis和session
const redis = require('redis') // 操纵redis
const bodyparser = require('koa-bodyparser')
const client = redis.createClient(6379, "localhost");
const app = new Koa();

// 数据库连接
const mongoose = require('./models/mongoose')

// keys作用：用来对cookie进行签名
app.keys = ['some secret', 'another secret'];

// 引入模板引擎
const hbs = require('koa-hbs')
const helpers = require('./utils/helpers')
app.use(hbs.middleware({
    viewPath: __dirname + '/views', //视图根目录
    defaultLayout: 'layout', //默认布局页面
    partialsPath: __dirname + '/views/partials', //注册partial目录
    disableCache: true //开发阶段不缓存
}));

// 导入路由文件
const index = require('./routes/index')
const users = require('./routes/users')

// 中间件框架
// 中间件是一个异步函数，对用户请求和响应做预处理

// 错误处理中间件写在最上面
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // 系统日志
    console.log(error);
    // 给用户显示信息
    // ctx.status = error.statusCode || error.status || 500;
    // ctx.type = "json";
    ctx.type = 'text'
    if (error.expose) {
        ctx.body = error.message;
    } else {
        ctx.body = error.stack;
    }
    
    // 全局错误处理
    ctx.app.emit("error", error);
  }
});

// 静态文件服务
app.use(static(__dirname + '/public'))

// 注册bodyparser
app.use(bodyparser())

// session配置
const SESS_CONFIG = {
  key: 'kkb:sess', // 设置cookie中的key名字 sid koa:sess
  maxAge: 86400000,  // 有效期：默认一天
  httpOnly: true, // 仅服务端修改
  signed: true, // 签名cookie
  store: redisStore({client})  // 使用redis存储session数据
};

app.use(session(SESS_CONFIG, app));
// app.use(ctx => {
//   if (ctx.path === '/favicon.ico') return;
//   // 访问
//   let n = ctx.session.count || 0;
//   // 设置
//   ctx.session.count = ++n;
//   ctx.body = '第' + n + '次访问';
//   // 查询redis数据
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
app.use(require('./middleware/get-vip'))


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


// 监听全局错误事件
app.on("error", err => {
  // console.error(err);
});

//开始监听端口，等同于http.createServer(app.callback()).listen(3000);
app.listen(3000);
