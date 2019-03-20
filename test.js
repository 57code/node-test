// const http = require('http')

// const server = http.createServer((req, res)=>{
//     res.writeHead(200)
//     res.end('hi kaikeba')
// })

// server.listen(3000,()=>{
//     console.log('监听端口3000')
// })

// 测试代码，test-getter-setter.js
// const kaikeba = {
//     info:{ name: '开课吧', desc: '开课吧真不错' },
//     get name(){
//         return this.info.name
//     },
//     set name(val){
//         console.log('new name is' + val)
//         this.info.name = val
//     }
// }
// console.log(kaikeba.name)
// kaikeba.name = 'kaikeba'
// console.log(kaikeba.name)

// 函数组合
// function add(x, y) {
//   return x + y;
// }
// function square(z) {
//   return z * z;
// }
// const ret = square(add(1,2))
// console.log(ret); // 9

// // compose 1.0: 函数个数写死
// function compose(fn1,fn2) {
//     return (...args) => fn1(fn2(...args))
// }
// console.log(compose(square, add)(1,2))

// // compose 2.0:多函数组合
// function compose2(mids) {
//     const len = mids.length;
//     return (...args)=>{
//         // 获取初始值
//         let res = mids[0](...args);
//         for (let i = 1; i < len; i++) {
//             res = mids[i](res)
//         }
//         return res;
//     }
// }
// console.log(compose2([add,square])(1,2))

// 异步复合
function sleep() {
    return new Promise((resolve)=>{
        setTimeout(() => {
            resolve()
        }, 2000);
    })
}



async function fn1(next) {
  console.log("fn1");
  setTimeout(() => {
      console.log('fn1-settimeout');
  }, 1000);
  await next();
  console.log("end fn1");
}
async function fn2(next) {
  console.log("fn2");
  await sleep();
  await next();
  console.log("end fn2");
}
async function fn3(next) {
  console.log("fn3");
}

function composeAsync(mids) {
  return function() {
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
        fn(function next() {
          return dispatch(i + 1);
        })
      );
    }
  };
}

composeAsync([fn1, fn2, fn3])().then(() => console.log('任务执行结束'));
