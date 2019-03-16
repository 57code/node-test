// 加载器：用于加载路由、控制器、服务、中间件等等
const fs = require("fs");
const path = require("path");
const Router = require("koa-router");

// 读取指定目录下的所有文件并按要求处理
function load(dir, cb) {
  // 获取routes文件夹路径
  const url = path.resolve(__dirname, dir);
  // 遍历路径下所有文件
  const files = fs.readdirSync(url); // 文件名数组
  files.forEach(filename => {
    // 去后缀名
    filename = filename.replace(".js", "");
    // 导入文件
    const file = require(url + "/" + filename);
    // 处理文件
    cb(filename, file);
  });
}

// 加载路由
function initRouter(app) {
  const router = new Router();

  // 加载文件
  load("routes", (filename, routes) => {
    // 若为index，则前缀为'/'，否则为文件名
    const prefix = filename === "index" ? "" : `/${filename}`;

    // routes可能是函数
    routes = typeof routes === "function" ? routes(app) : routes;

    // 遍历文件中所有路由配置
    Object.keys(routes).forEach(key => {
      const [method, path] = key.split(" ");
      console.log(`映射路由地址：${method} ${prefix}${path}`);
      // router.get('/',ctx=>{})
      // 注册路由，等同于上面一行
      router[method](prefix + path, async ctx => {
        app.ctx = ctx;
        await routes[key](app); // 路由接收到的就是app啦，可以放心使用
      });
    });
  });

  return router;
}

// 加载控制器
function initController(app) {
  const controllers = {};

  // 加载文件
  load("controller", (filename, controller) => {
    controllers[filename] = controller;
  });

  return controllers;
}
// 加载服务
function initService(app) {
  const services = {};

  // 加载文件
  load("service", (filename, service) => {
    services[filename] = service(app);
  });

  return services;
}

module.exports = { initRouter, initController, initService };
