// 内建模块
const os = require("os");
const cpuStat = require("cpu-stat");

// function showStatistics() {
//   const mem = (os.freemem() / os.totalmem()) * 100;
//   console.log(`内存占用率${mem}%`);

//   // 第三方模块
//   cpuStat.usagePercent((err, percent) => {
//     console.log(`cpu占用率：${percent}`);
//   });
// }

// setInterval(showStatistics, 1000);

// 自定义模块
const conf = require('./conf');
console.log(conf);

const {rmbToDollar} = require('./currency')(6);
console.log(rmbToDollar(10));
