module.exports = {
    aton : function(ip){
        // split into octets
        var a = ip.split('.');
        var buffer = new ArrayBuffer(4);
        var dv = new DataView(buffer);
        for(var i = 0; i < 4; i++){
            dv.setUint8(i, a[i]);
        }
        return(dv.getUint32(0));
    },
    ntoa : function(num){
        var nbuffer = new ArrayBuffer(4);
        var ndv = new DataView(nbuffer);
        ndv.setUint32(0, num);
    
        var a = new Array();
        for(var i = 0; i < 4; i++){
            a[i] = ndv.getUint8(i);
        }
        return a.join('.');
    },
}