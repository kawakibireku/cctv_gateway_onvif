var node_onvif = require('node-onvif');
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
            pass: 'labiot2019'
        });
        rtsp.init().then(()=>{
            let url = rtsp.getUdpStreamUrl();
            console.log(url);
        }).catch((error)=>{
            console.log(error)
        })

    })
}).catch((error)=>{
    console.log(error);
});