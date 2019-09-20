var node_onvif = require('node-onvif');
var utils = require('./utils.js');
var parseurl = require('url');
var os = require('os');
var ifaces = os.networkInterfaces();
var address = require('address');
var exec = require('child_process').exec;


var devices = {}

console.log('Start the discovery process')
node_onvif.startProbe().then((device_list) => {
    console.log(device_list.length + ' devices were found');
    /* device_list.array.forEach(info => {
        console.log('- '+ info.urn)
        console.log('  - '+ info.name)
        console.log('    - '+ info.info.xaddrs[0])
    }); */
    device_list.forEach((device) => {
        console.log(JSON.stringify(device));
        let rtsp = new node_onvif.OnvifDevice({
            xaddr: device.xaddrs[0],
            user: 'admin',
            pass: ''
        });
        rtsp.init().then(()=>{
            let url = rtsp.getUdpStreamUrl();
            const parsurl = parseurl.parse(url);
            var pathname = parsurl.pathname;
            var port2 = parsurl.port;
            var hostname = parsurl.hostname;
            var search = parsurl.search;
            cmd.get(
                'sudo iptables -t nat -S | grep PREROUTING',
                function (err, data, stderr) {
                    console.log(data);
                    let useport = utils.getAvailablePort(data, port);
                        console.log(hostname);
                    var hostbuatkamera = parsurl.hostname;
                    let parsedurl = "rtsp://" + user + ":" + pass + "@" + address.ip('tun0') + ":" + useport + pathname + search;
                    utils.parsingIptables(data, useport, hostbuatkamera);
                    var x = 'sudo sh -c echo 1" > /proc/sys/net/ipv4/ip_forward"'
                    dir = exec("" + x + "", function (err, stdout, stderr) {
                        if (err) {
                            // should have err.code here?
                            console.log(err);
                            console.log(stderr);
                        }
                        console.log(stdout);
                    });
                    dir.on('exit', function (code) {
                        console.log("INITIALIZE IPTABLES SUCCESS");
                    });
                    dir = exec("sudo iptables -t nat -A PREROUTING -p tcp --dport " + useport + " -j DNAT --to-destination " + hostbuatkamera + ":" + port2 + "", function (err, stdout, stderr) {
                        if (err) {
                            // should have err.code here?  
                        }
                        console.log(stdout);
                    });
                    dir.on('exit', function (code) {
                        console.log("NAT PRE ROUTING SUCCESS");
                    });
                    dir = exec("sudo iptables -t nat -A POSTROUTING -p tcp -d " + hostbuatkamera + " --dport " + port2 + " -j SNAT --to-source " + address.ip('tun0') + "", function (err, stdout, stderr) {
                        if (err) {
                            // should have err.code here?  
                        }
                        console.log(stdout);
                    });
                    dir.on('exit', function (code) {
                        console.log("NAT POSTROUTING SUCCESS");
                    });
                    var z = 'sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"';
                    dir = exec("" + z + "", function (err, stdout, stderr) {
                        if (err) {
                            // should have err.code here?  
                        }
                        console.log(stdout);
                    });
                    dir.on('exit', function (code) {
                        console.log("IPTABLES SAVE SUCCESS");
                    });
                    console.log(parsedurl);
                    return;
            });
            console.log(url);
        }).catch((error)=>{
            console.log(error)
        })
    })
}).catch((error)=>{
    console.log(error);
});