function delay(data, tick) {
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(data)
        }, tick);
    })
}

module.exports = app => ({
    async getUser(){
        return delay('jerry', 1000)
    }
})