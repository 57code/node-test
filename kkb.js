const Koa = require("koa");
const app = new Koa();
const {initRouter,initController,initService} = require('./kkb-loader')

class kkb {
    constructor(conf) {
        this.$app = new Koa(conf);
        this.$ctrl = initController(this);
        this.$serv = initService(this);
        this.$router = initRouter(this);
        this.$app.use(this.$router.routes())
    }

    start(port) {
        this.$app.listen(port,()=>{
            console.log('服务器启动成功，端口：'+ port);
            
        })
    }
}

module.exports = kkb;