const Router = require("koa-router");
const router = new Router({ prefix: "/api" });

const captcha = require("trek-captcha");
router.get("/captcha", async ctx => {
  const { token, buffer } = await captcha({ size: 4 });
  console.log(token);
  ctx.session.captcha = token;
  ctx.body = buffer;
});

// 发短信
const moment = require("moment");
const md5 = require("md5");
const axios = require("axios");
const qs = require("querystring");
router.get("/sms", async function(ctx) {
  try {
    // 生成6位随机码
    let code = ran(6);

    console.log(code);
    // 构造请求参数
    const to = ctx.query.to; //目标手机
    const accountSid = "3324eab4c1cd456e8cc7246176def24f"; // 账号id
    const authToken = "b1c4983e2d8e45b9806aeb0a634d79b1"; // 令牌
    const templateid = "613227680"; // 短信内容模板id
    const param = `${code},1`; // 短信参数
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const sig = md5(accountSid + authToken + timestamp); // 签名

    //   key=val&key2=val2
    const resp = await axios.post(
      "https://api.miaodiyun.com/20150822/industrySMS/sendSMS",
      qs.stringify({ to, accountSid, templateid, sig, param, timestamp }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (resp.data.respCode === "00000") {
      // 发送成功
      // 计算1分钟后时间
      const expires = moment()
        .add(1, "minutes")
        .toDate();
      ctx.session.smsCode = { to, code, expires };
      ctx.body = { ok: 1, code };
    } else {
      ctx.status = 400;
      ctx.body = { ok: 0, message: resp.data.respDesc };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { ok: 0, message: error.message };
  }
});

function ran(bit) {
  let result = "";
  for (let i = 0; i < bit; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

module.exports = router;
