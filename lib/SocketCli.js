/**
 * Created by Z on 2017-03-07.
 */
const Client = require('socket.io-client');
const EventEmitter = require('events').EventEmitter;
const debug = require('./utils').debug('Discover-Client');
const os = require('os');

function onConnect() {
    if (this.storage) {
        this.storage.addClient(this.host, this.port, this.id);
    }
    debug('onConnect', this.id, this.storage);
}

function onDisconnect() {
    if (this.storage) {
        this.storage.removeClient(this.id);
        let {serviceName, config}=this.storage.removeService(this.id);
        if (serviceName) {
            this.broadcast && this.broadcast.emit('removeService', serviceName, config);
        }
    }
    debug('onDisconnect', this.id, this.storage);
}


function onRegiste(host, port) {
    // if (this.storage) {
    //     this.storage.addClient(host, port, this.id);
    // }
    debug('onRegiste', this.id, {host, port}, this.storage);
    if (this.server && this.server.discover) {
        this.server.discover.tryConnect(port, host)
    }
    this.broadcast.emit('newDiscoverServer', host, port);
}

function onNewDiscoverServer(host, port) {
    debug('onNewDiscoverServer', host, port);
    if (this.server && this.server.discover) {
        this.server.discover.tryConnect(port, host);
    }
}

function onSyncServers(servers) {
    debug('onSyncServer', servers);
    if (this.server && this.server.discover) {
        servers.forEach((item) => {
            let items = item.split(':');
            let host = items[0];
            let port = parseFloat(items[1]);
            this.server.discover.tryConnect(port, host)
        })
    }
}

function onAddService(serviceName, config) {
    debug('onAddService', serviceName, config);
    if (this.storage) {
        this.storage.addService(this.id, serviceName, config);
        this.broadcast && this.broadcast.emit('addService', serviceName, config);
    }
}

function onRemoveService(serviceName, config) {
    debug('removeService', {serviceName, config})
    if (this.storage) {
        this.storage.removeServiceByServiceNameAndConfig(serviceName, config);
    }
}

class SocketCli extends EventEmitter {
    constructor(storage) {
        super();
        this.init(storage);
    }

    init(storage) {
        this.storage = storage;
        this.on('disconnect', onDisconnect.bind(this));
        this.on('connect', onConnect.bind(this));
        this.on('registe', onRegiste.bind(this));
        this.on('newDiscoverServer', onNewDiscoverServer.bind(this));
        this.on('syncServers', onSyncServers.bind(this));
        this.on('addService', onAddService.bind(this));
        this.on('removeService', onRemoveService.bind(this));
    }

    connect(uri) {
        this.uri = uri || 'ws://localhost:9004';
        this.client = Client(this.uri);
        this.client.on('connect', () => {
            this.id = this.client.id;
            debug('connect to', this.uri);
            this.emit('connect', this);
        });
        this.client.on('disconnect', () => {
            this.emit('disconnect');
        });
        this.client.on('newDiscoverServer', (host, port) => {
            this.emit('newDiscoverServer', host, port);
        });
        this.client.on('syncServers', (servers) => {
            this.emit('syncServers', servers);
        });
        this.client.on('addService', (serviceName, config) => {
            this.emit('addService', serviceName, config);
        });
        this.client.on('removeService', (serviceName, config) => {
            this.emit('removeService', serviceName, config);
        });
    }

    registe(port) {
        this.client.emit('registe', os.hostname(), port);
    }

    addService(serviceName, config) {
        this.client.emit('addService', serviceName, config);
    }

}

module.exports = SocketCli;