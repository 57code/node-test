const http = require("http");
const fs = require("fs");

http
  .createServer((req, res) => {
    const { method, url } = req;
    if (method == "GET" && url == "/") {
      fs.readFile("./index.html", (err, data) => {
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      });
    } else if ((method == "GET" || method == "POST") && url == "/users") {
      res.setHeader("Content-Type", "application/json");
      //   简单请求cors
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.end(JSON.stringify([{ name: "tom", age: 20 }]));
    } else if (method == "OPTIONS" && url == "/users") {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "http://localhost:3001",
        "Access-Control-Allow-Headers": "X-Token,Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,PUT",
        "Access-Control-Allow-Credentials": "true"
      });
      res.end();
    }
  })
  .listen(3000);
