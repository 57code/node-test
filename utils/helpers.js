const hbs = require("koa-hbs");
const moment = require("moment");

// const helpers = require('handlebars-helpers');
// helpers.comparison({ handlebars: hbs.handlebars });

// 日期格式化
hbs.registerHelper("date", (date, pattern) => {
  try {
    return moment(date).format(pattern);
  } catch (error) {
    return "";
  }
});