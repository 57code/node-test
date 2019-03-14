const jsonwebtoken = require("jsonwebtoken");
const secret = "12345678";

const user = {
  username: "abc",
  age: 20
};

// 签发一个令牌
const token = jsonwebtoken.sign(user, secret);
console.log("生成token:", token);

// 伪造一个令牌
const token2 = jsonwebtoken.sign({ username: "def", age: 20 }, "wrong secret");

// 解码payload内容
const buf = Buffer.from(
  "eyJkYXRhIjp7InVzZXJuYW1lIjoiYWJjIiwiYWdlIjoyMH0sImV4cCI6MTU1MjQ0OTc1MSwiaWF0IjoxNTUyNDQ2MTUxfQ",
  "base64"
);
console.log(buf.toString());

// 校验
console.log("解码:", jsonwebtoken.verify(token, secret));
// 伪造的令牌校验会报错，因为秘钥不匹配
try {
  jsonwebtoken.verify(token2, secret);
} catch (error) {
  console.error(error.message)
}
