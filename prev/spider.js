// 用来发送https请求
const originRequest = require("request");
// 类似服务端jquery
const cheerio = require("cheerio");
// 解码
const iconv = require("iconv-lite");

function request(url, callback) {
  const options = {
    url: url,
    encoding: null // 返回Buffer数据
  };
  originRequest(url, options, callback);
}


for (let i = 100570; i < 100580; i++) {
  const url = `https://www.dy2018.com/i/${i}.html`;
  request(url, function(err, res, body) {
    const html = iconv.decode(body, "gb2312");
    // console.log(html);
    
    const $ = cheerio.load(html);
    console.log($(".title_all h1").text());
  });
}