## TuRing-CDS

### cds-discover

    npm install cds-discover --save
    
### 去中心化服务集群

### Example

    const Discover = require('cds-discover');
    
    const discover = new Discover();
    
    disconver
        //本地服务监听端口
        .listen(9004)
        //尝试连接到 discover.cavacn.com 根服务器,当然你也可以是  localhost
        //为什么要这个，因为你肯定需要一个领路人，要不然你无法加入这个圈子
        .tryConnect(9004,'discover.cavacn.com');
    discover.on('init',()=>{
        //初始化完成之后
        let serviceName = 'YourServiceName';
        let serviceConfig = 'YourServiceConfig'
        //把service注册到  服务集群中
        discover.addService(serverName,serverConfig);
    });
    
    discover.watch('你需要监听的service  , . 通配所有',(method,serviceName,config)=>{
        console.log('watch',method,serviceName,config);
    });