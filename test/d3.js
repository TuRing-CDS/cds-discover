/**
 * Created by Z on 2017-03-08.
 */
const Discover = require('../lib/Discover');

const disconver = new Discover();

disconver.listen(9007).tryConnect(9005);

disconver.watch('.',(method,serviceName,config)=>{
    console.log(method,serviceName,config);
})