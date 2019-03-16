const Koa = require("koa");
const app = new Koa();


//开始监听端口，等同于http.createServer(app.callback()).listen(3000);
app.listen(3000);
