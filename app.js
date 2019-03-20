const KKB = require("./kkb");

const app = new KKB();

function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

app.use(require('./static')());
app.use(require('./logger'));
app.use(require('./blacklist'));

app.use(async (ctx, next) => {
  ctx.body = "1";
  await sleep();
  await next();
  ctx.body += "2";
});
app.use(async (ctx, next) => {
  ctx.body += "3";
  await next();
  ctx.body += "4";
});
app.use(async (ctx, next) => {
  ctx.body += "5";
});

// 设置host参数，表名ipv4
app.listen(3000, '0.0.0.0');
