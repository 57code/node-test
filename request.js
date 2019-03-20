module.exports = {
  get url() {
    // req是node原始请求对象
    return this.req.url;
  },
};
