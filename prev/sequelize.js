const Sequelize = require("sequelize");

// 建立连接
const sequelize = new Sequelize("test", "root", "admin", {
  host: "localhost",
  dialect: "mysql", // mysql/postgre/sql server/sql lite
  operatorsAliases: false
});

// 1.定义模型 Model - Table
// const Fruit = sequelize.define(
//   "fruit",
//   {
//     name: {
//       type: Sequelize.STRING(20),
//       get() {
//         const name = this.getDataValue("name");
//         const price = this.getDataValue("price");
//         return `${name}(价格：${price})`;
//       }
//     },
//     price: {
//       type: Sequelize.FLOAT,
//       allowNull: false,
//       validate: {
//         isFloat: { msg: "价格字段必须输入数字" },
//         min: { args: [0], msg: "价格字段必须大于0" }
//       }
//     },
//     stock: { type: Sequelize.INTEGER, defaultValue: 0 }
//   },
//   {
//     timestamps: false,
//     freezTableName: true, // 表名冻结
//     getterMethods: {
//       amount() {
//         return this.getDataValue("stock") + "kg";
//       }
//     },
//     setterMethods: {
//       amount(val) {
//         const idx = val.indexOf("kg");
//         const v = val.slice(0, idx);
//         this.setDataValue("stock", v);
//       }
//     }
//   }
// );

// 模型扩展
// Fruit.classify = function(name) {
//   const tropicFruits = ["香蕉", "芒果"];
//   return tropicFruits.includes(name) ? "热带水果" : "其他水果";
// };

// // 实例方法
// Fruit.prototype.totalPrice = function(count) {
//   return this.price * count;
// };

// const arr = ["草莓", "aaa"];
// arr.forEach(f => {
//   console.log(Fruit.classify(f));
// });
// 同步
// Fruit.sync({ force: true })
//   .then(() => {
//     // 添加数据
//     return Fruit.create({ name: "香蕉", price: 3.5 });
//   })
//   .then(async () => {
//     // 查询
//     let fruits = await Fruit.findAll();

//     // 查询操作符
//     const Op = Sequelize.Op;
//     fruits = await Fruit.findAll({
//       where: {
//         price: { [Op.lt]: 5 }
//       }
//     });

//     // 聚合
//     // Fruit.max("price");
//     // Fruit.sum("price");

//     // 更新
//     await Fruit.update({ price: 5 }, { where: { id: 1 } });

//     // 删除
//     await Fruit.destroy({ where: { id: 1 } });

//     // .then(fruits => {
//     // console.log(JSON.stringify(fruits));

//     // 更新实例
//     // fruits[0].amount = "100kg";
//     // fruits[0].save();

//     // console.log(fruits[0].totalPrice(50))

//     // 数据查询
//     // id
//     // Fruit.findById(1).then(fruit=>console.log(fruit.get()))
//     // 条件 where
//     // Fruit.findOne({where:{name:'香蕉'}}).then(fruit=>console.log(fruit.get()))

//     // });
//   })
//   .catch(err => {
//     console.log(err.message);
//   });

// 1:N关系
const Player = sequelize.define("player", { name: Sequelize.STRING });
const Team = sequelize.define("team", { name: Sequelize.STRING });

// 会添加teamId到Player表作为外键
Player.belongsTo(Team); // 1端建立关系
Team.hasMany(Player); // N端建立关系

// 多对多关系
const Fruit = sequelize.define("fruit", { name: Sequelize.STRING });
const Category = sequelize.define("category", { name: Sequelize.STRING });
Fruit.FruitCategory = Fruit.belongsToMany(Category, {
  through: "FruitCategory"
});

// 同步
sequelize.sync({ force: true }).then(async () => {
  await Team.create({ name: "火箭" });
  await Player.bulkCreate([
    { name: "哈登", teamId: 1 },
    { name: "保罗", teamId: 1 }
  ]);

  // 1端关联查询
  const players = await Player.findAll({ include: [Team] });
  console.log(JSON.stringify(players, null, 2));

  // N端关联查询
  const team = await Team.findOne({
    where: { name: "火箭" },
    include: [Player],
  });
  console.log(JSON.stringify(team, null, 2));

  // 插入测试数据
  await Fruit.create(
    {
      name: "香蕉",
      categories: [{ id: 1, name: "热带" }, { id: 2, name: "温带" }]
    },
    {
      include: [Fruit.FruitCategory]
    }
  );
  // 多对多联合查询
  const fruit = await Fruit.findOne({
    where: { name: "香蕉" }, // 通过through指定条件、字段等
    include: [{ model: Category, through: { attributes: ["id", "name"] } }]
  });
});
