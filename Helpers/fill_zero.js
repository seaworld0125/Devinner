fillZero = function(width, data){
    let str = data.toString();
    return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;//남는 길이만큼 0으로 채움
};

module.exports = fillZero;