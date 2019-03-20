// ctx.url
// ctx.body
module.exports = {
    // 是request里面别名
    get url() {
        return this.request.url;
    },
    // 是response的别名
    // ctx.request.body
    get body() {
        return this.response.body;
    },
    set body(val) {
        this.response.body = val;
    }
}