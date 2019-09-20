// var Cam= require('./models/cam');
var cmd=require('node-cmd');

exports.parsingIptables = function(stdout,p,host) {
    const list = stdout.split('\n');
    
    // Check berapa line
    const nline = list.length;
    if (nline === 1 && list[0] === '') {
        return false;
    }
    
    // Parsing setiap line
    for (let i = 0; i < nline; i++) {
        
        const port = list[i].substr(list[i].indexOf('--dport') + 8, 4).trim();
        const ip = list[i].substr(list[i].indexOf('--to-destination') + 17, list[i].length - list[i].indexOf('--to-destination') + 17).trim();
        console.log(port,p,ip.split(':')[0],host);
        if(port === p || ip.split(':')[0] === host){
            // exec command
            cmd.run('sudo iptables -t nat -D PREROUTING -p tcp -m tcp --dport ' + port + ' -j DNAT --to-destination ' + ip);
        }
    }
}
/* exports.getdata = function (callback){
    Cam.find(function(err, cam) {
        var i;
        var datacam = [] ;
        for(i = 0; i<cam.length; i++){
            datacam.push({
                namecam: cam[i].namecam,
                iporiginal: cam[i].iporiginal,
                ipvpn: cam[i].ipvpn,
                portvpn: cam[i].portvpn
            })

        }
        callback(datacam);
    });
}
 */
exports.getAvailablePort = function (stdout, p) {
    const list = stdout.split('\n');
    
    // Check berapa line
    const nline = list.length;
    if (nline === 1 && list[0] === '') {
      return p;
    }
    
    // Parsing setiap line
    let portAvailable = p;
    for (let i = 8001; i < 8050; i++) {
      let isAvailable = true;
      for (let j = 0; j < nline; j++) {
        const port = list[j].substr(list[j].indexOf('--dport') + 8, 4).trim();
        
        if (port === i.toString()) {
          isAvailable = false
        }
      }
      
      if (isAvailable) {
        portAvailable = i.toString();
        break;
      }
    }
    
    return portAvailable;
}