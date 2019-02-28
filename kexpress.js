const http = require("http");
const url = require("url");
// 实现一个路由器
let router = [];

class Application {
  get(path, handler) {
    //   console.log(path,handler);
      
    router.push({
      path,
      method: "get",
      handler
    });
  }

  listen() {
    // 创建server
    http.createServer((req, res) => {
        let {pathname} = url.parse(req.url, true);
        console.log(url.parse(req.url, true));
        
        for (const route of router) {
            if (route.path === pathname) {
                route.handler(req, res);
                return;
            }
        }

    }).listen(...arguments);
  }
}

module.exports = function (config) {
    return new Application();
}