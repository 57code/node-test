const kexpress = require("./kexpress");
const app = kexpress();
const fs = require("fs");
const path = require("path");

app.get("/", (req, res) => {
  // 读取首页
  // console.log(path.resolve('./index.html'));

  fs.readFile(path.resolve("./index.html"), (err, data) => {
    if (err) {
      res.statusCode = 500; // 服务器内部错误
      res.end("500 - Internal Server Error!");
      return;
    }
    res.statusCode = 200; // 请求成功
    res.setHeader("Content-Type", "text/html");
    res.end(data);
  });
});
app.get("/users", (req, res) => {
  // 接口编写
  res.statusCode = 200; // 请求成功
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify([{ name: "tom", age: 20 }]));
});

app.listen(3001);
