// buffer: 八位字节组成数组，可以有效的在js中存储二进制数据
// 创建
const buf1 = Buffer.alloc(10);
console.log(buf1);

// 从数据创建
const buf2 = Buffer.from([1,2,10])
console.log(buf2);

const buf3 = Buffer.from('hello, 开课吧')
console.log(buf3);

// 写入
buf1.write('hellofjfjfjfjfjf')
console.log(buf1);

// 读取
console.log(buf3.toString());
console.log(buf3.toString('ascii'));

// 合并
const buf4 = Buffer.concat([buf1,buf3])
console.log(buf4.toString());
