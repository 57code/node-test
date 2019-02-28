let rate;
function rmbToDollar(rmb){
    return rmb/rate;
}
module.exports = function (r) {
    rate = r;
    return {rmbToDollar}
}