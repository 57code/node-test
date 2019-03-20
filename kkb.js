const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");

class KKB {
  constructor() {
      this.middlewares = [];
  }
  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const ctx = this.createContext(req, res);
      
      // 合成中间件函数
      const fn = this.compose(this.middlewares)

      await fn(ctx);

      // 渲染结果
      res.end(ctx.body)
    });

    server.listen(...args);
  }

  compose(mids) {
    return function(ctx) {
      // 组合结果函数
      // 执行第0个
      return dispatch(0);
  
      // 需要返回Promise
      function dispatch(i) {
        let fn = mids[i];
        if (!fn) {
          // 执行任务结束
          return Promise.resolve();
        }
        return Promise.resolve(
          fn(ctx, function next() {
            return dispatch(i + 1);
          })
        );
      }
    };
  }

  createContext(req, res) {
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);
    //   添加引用
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;

    return ctx;
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }
}

module.exports = KKB;
