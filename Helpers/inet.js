module.exports = {
    aton : function(ip) {
        // split into octets
        var a = (ip||'').split('.');
        var buffer = new ArrayBuffer(4);
        var dv = new DataView(buffer);
        for(let i = 0; i < 4; i++){
            dv.setUint8(i, a[i]);
        }
        return(dv.getUint32(0));
    },
    ntoa : function(num) {
        var nbuffer = new ArrayBuffer(4);
        var ndv = new DataView(nbuffer);
        ndv.setUint32(0, num);
    
        var a = new Array();
        for(let i = 0; i < 4; i++){
            a[i] = ndv.getUint8(i);
        }
        return a.join('.');
    },
    getIp : function(req) {
        var ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
        let i;
        for(i = 0; i < ip.length; i++) 
            if(ip[i] >= '0' && ip[i] <= '9') break;

        ip = ip.substr(i, ip.length-i+1);
        return ip;
    }
}