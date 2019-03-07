// 客户端
const MongoClient = require("mongodb").MongoClient;

// 连接URL
const url = "mongodb://localhost:27017";

// 数据库名
const dbName = "test";

(async function() {
  // 0.创建客户端
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    // 1.连接数据库，返回Promise
    await client.connect();
    console.log("连接成功");

    // 2.获取数据库
    const db = client.db(dbName);

    // 3.获取集合
    const fruitsColl = db.collection("fruits");

    // 4.插入文档，返回Promise<CommandResult>
    let r = await fruitsColl.insertOne({ name: "芒果", price: 20.0 });
    r = await fruitsColl.insertOne({ name: "百香果", price: 15 });
    console.log("插入成功", r.result);

    // 分组，求和
    r = await fruitsColl
      .aggregate([
        { $match: { name: "芒果" } },
        { $group: { _id: "$name", total: { $sum: "$price" } } }
      ])
      .toArray();
    console.log(r);

    // 5.查询文档
    r = await fruitsColl.findOne({
      //   $or: [{ price: { $gte: 20 } }, { price: { $lte: 10 } }]
      //   $and: [{ price: { $gte: 10 } }, { price: { $lte: 20 } }]
      //   price:{$gte:10, $lte:20}
      name: { $regex: /果/ }
    });
    console.log("查询结果", r);

    // 6.更新文档，返回Promise<CommandResult>
    r = await fruitsColl.updateOne(
      { name: "芒果" },
      { $set: { name: "苹果" } }
    );
    console.log("更新成功", r.result);

    // 7.删除文档
    // r = await fruitsColl.deleteOne({name:"苹果"});
    // console.log('删除成功', r.result);

    // 查询方圆1公里以内的地铁站
    const stations = db.collection("stations");
    // await stations.insertMany([
    //   { name: "天安门东", loc: [116.407851, 39.91408] },
    //   { name: "天安门西", loc: [116.398056, 39.913723] },
    //   { name: "王府井", loc: [116.417809, 39.91435] }
    // ]);
    // await stations.createIndex({loc:'2dsphere'})
    // r = await stations.find({
    //     loc:{
    //         $nearSphere: {
    //             $geometry:{
    //                 type: 'Point',
    //                 coodinates:[116.403847, 39.915526]
    //             },
    //             $maxDistance: 1000
    //         }
    //     }
    // }).toArray();
    // console.log('天安门附近地铁站：', r);

    await stations.insertMany([
      { name: "天安门东", loc: [116.407851, 39.91408] },
      { name: "天安门西", loc: [116.398056, 39.913723] },
      { name: "王府井", loc: [116.417809, 39.91435] }
    ]);
    await stations.createIndex({ loc: "2dsphere" });
    r = await stations
      .find({
        loc: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [116.403847, 39.915526]
            },
            $maxDistance: 1000
          }
        }
      })
      .toArray();
    console.log("天安门附近地铁站", r);
  } catch (error) {
    console.error(error);
  }

  //   client.close();
})();
