var node_onvif = require('node-onvif');
var utils = require('./utils.js');
var parseurl = require('url');
var os = require('os');
var ifaces = os.networkInterfaces();
var address = require('address');
var exec = require('child_process').exec;
var axios = require('axios')

var devices = {}


var USERNAME_CAMERA = "admin"
var PASSWORD_CAMERA = "admin"
var API_KEY_SUPER = "kawakibi"

var EMAIL = "test2@gmail.com"
var PASS_USER = "test2"

var GROUP_KEY_USER;
var AUTH_USER;

console.log('Start the discovery process')
axios.post('http://localhost:8080/?json=true',{machineID: "superuser", mail: EMAIL, pass: PASS_USER , function: "dash"}).then(function(response){
            AUTH_USER = response.data.$user.auth_token
            GROUP_KEY_USER = response.data.$user.ke

            console.log(response.data.$user.auth_token)
            console.log(response.data.$user)
           })
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
            user: USERNAME_CAMERA,
            pass: PASSWORD_CAMERA
        });
        rtsp.init().then(()=>{
            let url = rtsp.getUdpStreamUrl();
            const parsurl = parseurl.parse(url);
            var pathname = parsurl.pathname;
            var port2 = parsurl.port;
            var hostname = parsurl.hostname;
            var search = parsurl.search;
            let parsedurl
            // PORT FORWARDING
            cmd.get(
                'sudo iptables -t nat -S | grep PREROUTING',
                function (err, data, stderr) {
                    console.log(data);
                    let useport = utils.getAvailablePort(data, port);
                    console.log(hostname);
                    var hostbuatkamera = parsurl.hostname;
                    parsedurl = "rtsp://" + USERNAME_CAMERA + ":" + PASSWORD_CAMERA + "@" + address.ip('tun0') + ":" + useport + pathname + search;
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

            //  ADD MONITOR
            axios.post('http://localhost:8080/'+AUTH_USER+'/configureMonitor/'+GROUP_KEY_USER+'/'+device.name+'/add', 
            {"data":
            {"mode":"start","mid":"10998","name":device.name,"type":"h264","protocol":"rtsp","host":address.ip('tun0'),"port":useport,"path": pathname,"ext":"mp4","fps":"3","width":"2048","height":"1536","details":"{\"notes\":\"\",\"dir\":\"\",\"auto_host_enable\":\"1\",\"auto_host\":\""+parsedurl+"\",\"rtsp_transport\":\"tcp\",\"muser\":\"user\",\"mpass\":\"pass\",\"port_force\":null,\"fatal_max\":\"0\",\"aduration\":\"1000000\",\"probesize\":\"1000000\",\"stream_loop\":null,\"sfps\":\"\",\"accelerator\":\"0\",\"hwaccel\":\"cuvid\",\"hwaccel_vcodec\":\"h264_cuvid\",\"hwaccel_device\":\"\",\"stream_type\":\"mp4\",\"stream_flv_type\":\"http\",\"stream_flv_maxLatency\":\"\",\"stream_mjpeg_clients\":\"0\",\"stream_vcodec\":\"copy\",\"stream_acodec\":\"no\",\"hls_time\":\"2\",\"hls_list_size\":\"2\",\"preset_stream\":\"\",\"signal_check\":\"\",\"signal_check_log\":\"0\",\"stream_quality\":\"1\",\"stream_fps\":\"10\",\"stream_scale_x\":\"3072\",\"stream_scale_y\":\"1728\",\"rotate_stream\":null,\"svf\":\"\",\"tv_channel\":null,\"tv_channel_id\":\"\",\"tv_channel_group_title\":\"\",\"stream_timestamp\":null,\"stream_timestamp_font\":\"\",\"stream_timestamp_font_size\":\"\",\"stream_timestamp_color\":\"\",\"stream_timestamp_box_color\":\"\",\"stream_timestamp_x\":\"\",\"stream_timestamp_y\":\"\",\"stream_watermark\":\"0\",\"stream_watermark_location\":\"\",\"stream_watermark_position\":null,\"snap\":\"0\",\"snap_fps\":\"1\",\"snap_scale_x\":\"1920\",\"snap_scale_y\":\"1072\",\"snap_vf\":\"\",\"vcodec\":\"copy\",\"crf\":\"1\",\"preset_record\":\"\",\"acodec\":\"no\",\"dqf\":\"0\",\"cutoff\":\"\",\"rotate_record\":null,\"vf\":\"\",\"timestamp\":\"0\",\"timestamp_font\":\"\",\"timestamp_font_size\":\"\",\"timestamp_color\":\"\",\"timestamp_box_color\":\"\",\"timestamp_x\":\"\",\"timestamp_y\":\"\",\"watermark\":null,\"watermark_location\":\"\",\"watermark_position\":null,\"cust_input\":\"\",\"cust_snap\":\"\",\"cust_rtmp\":\"\",\"cust_rawh264\":\"\",\"cust_detect\":\"\",\"cust_stream\":\"\",\"cust_stream_server\":\"\",\"cust_record\":\"\",\"custom_output\":\"\",\"detector\":\"0\",\"detector_pam\":\"0\",\"detector_noise_filter\":null,\"detector_webhook\":\"0\",\"detector_webhook_url\":\"\",\"detector_command_enable\":\"0\",\"detector_command\":\"\",\"detector_command_timeout\":\"\",\"detector_lock_timeout\":\"\",\"detector_save\":\"0\",\"detector_frame_save\":\"0\",\"detector_mail\":\"0\",\"detector_mail_timeout\":\"\",\"detector_record_method\":\"sip\",\"detector_trigger\":\"1\",\"detector_trigger_record_fps\":\"\",\"detector_timeout\":\"10\",\"watchdog_reset\":\"0\",\"detector_delete_motionless_videos\":\"0\",\"detector_send_frames\":\"1\",\"detector_region_of_interest\":\"0\",\"detector_fps\":\"\",\"detector_scale_x\":\"640\",\"detector_scale_y\":\"480\",\"detector_use_motion\":\"1\",\"detector_use_detect_object\":\"0\",\"detector_frame\":\"0\",\"detector_sensitivity\":\"\",\"cords\":\"[]\",\"detector_buffer_vcodec\":\"auto\",\"detector_buffer_fps\":\"\",\"detector_buffer_hls_time\":\"\",\"detector_buffer_hls_list_size\":\"\",\"detector_buffer_start_number\":\"\",\"detector_buffer_live_start_index\":\"\",\"detector_lisence_plate\":\"0\",\"detector_lisence_plate_country\":\"us\",\"detector_notrigger\":\"0\",\"detector_notrigger_mail\":\"0\",\"detector_notrigger_timeout\":\"\",\"control\":\"0\",\"control_base_url\":\"\",\"control_url_method\":null,\"control_stop\":null,\"control_url_stop_timeout\":\"\",\"control_url_center\":\"\",\"control_url_left\":\"\",\"control_url_left_stop\":\"\",\"control_url_right\":\"\",\"control_url_right_stop\":\"\",\"control_url_up\":\"\",\"control_url_up_stop\":\"\",\"control_url_down\":\"\",\"control_url_down_stop\":\"\",\"control_url_enable_nv\":\"\",\"control_url_disable_nv\":\"\",\"control_url_zoom_out\":\"\",\"control_url_zoom_out_stop\":\"\",\"control_url_zoom_in\":\"\",\"control_url_zoom_in_stop\":\"\",\"groups\":\"\",\"loglevel\":\"quiet\",\"sqllog\":\"0\",\"detector_cascades\":\"\",\"stream_channels\":\"\",\"input_maps\":\"\",\"input_map_choices\":\"\"}","shto":"[]","shfr":"[]"}
            }).then(function(response){
                console.log(response.data)
            })
           
            // console.log(url);
        }).catch((error)=>{
            console.log(error)
        })
    })
}).catch((error)=>{
    console.log(error);
});