/**
 * Created by Z on 2017-03-07.
 */
const Discover = require('../lib/Discover');

const disconver = new Discover();

disconver.tryConnect(9006);

disconver.on('init',()=>{
    disconver.addService('./demo/hello',{
        config:'xxxxx2'
    });
});

disconver.watch('./demo/h',(method,serviceName,config)=>{
    console.log(method,serviceName,config);
});