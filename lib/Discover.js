/**
 * Created by Z on 2017-03-07.
 */
const SocketCli = require('./SocketCli');
const SocketServer = require('./SocketServer');
const Storage = require('./Storage');
const EventEmitter = require('events').EventEmitter;
const debug = require('./utils').debug('Discover-Center');
const os = require('os');
class Discover extends EventEmitter {
    constructor() {
        super();
        this.clients = {};
        this.server = null;
        this.storage = new Storage();
        this.storage.on('service', (method, serviceName, config) => {
            debug('onService', method, serviceName, config)
            if (this.watchFn) {
                this.watchFn(method, serviceName, config);
            }
        });
        this.isConnecting = false;
        this.isInit = false;
    }

    connect(host, port) {
        let client = new SocketCli(this.storage);
        client.host = host;
        client.port = port;
        client.server = this.server || {discover: this};
        client.connect(['ws://', host, ':', port].join(''));
        client.on('connect', () => {
            this.clients[client.id] = client;
            if (!this.isInit) {
                this.isInit = true;
                this.emit('init');
            }
            if (this.port) {
                client.registe(this.port);
            }
            debug('onConnect', client.id, Object.keys(this.clients).map((key) => {
                return this.clients[key].host + ':' + this.clients[key].port
            }));
            this.isConnecting = false;
            this.beginConnect();
        });
        client.on('disconnect', () => {
            delete this.clients[client.id];
            debug('onDisconnect', client.id, Object.keys(this.clients).map((key) => {
                return this.clients[key].host + ':' + this.clients[key].port
            }));
        });
        return this;
    }

    beginConnect() {
        if (this.storage.connectQueue.length && !this.isConnecting) {
            let item = this.storage.connectQueue.shift();
            if (!this.storage.isHasClient(item.host, item.port)) {
                debug('beginConnect', item);
                this.isConnecting = true;
                this.connect(item.host, item.port);
            }
            this.beginConnect();
        }
    }

    tryConnect(port, host) {
        this.storage.addConnect(host || os.hostname(), port);
        this.beginConnect();
    }

    addService(serviceName, config) {
        let keys = Object.keys(this.clients);
        if (keys.length) {
            config = 'object' === typeof(config) ? JSON.stringify(config) : config;
            this.clients[keys[0]].addService(serviceName, config);
        }
    }

    listen(port) {
        this.port = port;
        this.server = new SocketServer(port, this);
        this.server.listen();
        return this;
    }

    watch(serviceName, callback) {
        let reg = new RegExp(serviceName);
        this.watchFn = (method, serviceName, config) => {
            if (reg.exec(serviceName)) {
                callback(method, serviceName, config);
            }
        }
    }

}

module.exports = Discover;