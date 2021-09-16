module.exports = {
    aton : function(ip){
        // split into octets
        const a = ip.split('.');
        const buffer = new ArrayBuffer(4);
        const dv = new DataView(buffer);
        for(const i = 0; i < 4; i++){
            dv.setUint8(i, a[i]);
        }
        return(dv.getUint32(0));
    },
    ntoa : function(num){
        const nbuffer = new ArrayBuffer(4);
        const ndv = new DataView(nbuffer);
        ndv.setUint32(0, num);
    
        const a = new Array();
        for(const i = 0; i < 4; i++){
            a[i] = ndv.getUint8(i);
        }
        return a.join('.');
    },
}//const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;