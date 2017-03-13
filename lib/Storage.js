/**
 * Created by Z on 2017-03-08.
 */

const debug = require('./utils').debug('Discover-Storage')

const EventEmitter = require('events').EventEmitter;

class Storage extends EventEmitter {
    constructor() {
        super();
        this.clients = {};
        this.maps = {};
        this.services = {};
        this.serviceClientMap = {};
        this.connectQueue = [];
    }

    addConnect(host, port) {
        if (!this.isHasClient(host, port)) {
            debug('addConnect', {host, port}, this.connectQueue, this.clients);
            this.connectQueue.push({host, port});
        }
    }

    getId(host, port) {
        return [host, port].join(':');
    }

    addClient(host, port, clientId) {
        let id = this.getId(host, port);
        this.clients[id] = clientId;
        this.maps[clientId] = id;
        debug('addClient', {host, port, clientId})
    }

    removeClient(clientId) {
        if (this.maps[clientId]) {
            delete this.clients[this.maps[clientId]];
            delete this.maps[clientId];
            debug('removeClient', clientId);
        }
    }

    isHasClient(host, port) {
        let id = this.getId(host, port);
        return !!this.clients[id];
    }

    addService(clientId, serviceName, config) {
        if (!this.services[serviceName]) {
            this.services[serviceName] = new Set();
        }
        if (!this.services[serviceName].has(config)) {
            this.services[serviceName].add(config);
            this.serviceClientMap[clientId] = {serviceName, config};
            this.emit('service', 'addService', serviceName, config);
            // this.emit('service', 'addService', serviceName, this.services[serviceName]);
        }
        debug('addService', {clientId, serviceName, config});
    }

    removeService(clientId) {
        if (this.serviceClientMap[clientId]) {
            let {serviceName, config} = this.serviceClientMap[clientId];
            this.removeServiceByServiceNameAndConfig(serviceName, config, clientId);
            return {serviceName, config}
        }
        return {};
    }

    removeServiceByServiceNameAndConfig(serviceName, config, clientId) {
        if (this.services[serviceName]) {
            this.services[serviceName].delete(config);
            if (!this.services[serviceName].size) {
                delete this.services[serviceName];
            }
            if (!!clientId) {
                delete this.serviceClientMap[clientId];
            } else {
                Object.keys(this.serviceClientMap).forEach((clientId) => {
                    let item = this.serviceClientMap[clientId];
                    if (serviceName === item.serviceName && config === item.config) {
                        delete this.serviceClientMap[clientId];
                    }
                })
            }
            // this.emit('service', 'removeService', serviceName, this.services[serviceName]);
            this.emit('service', 'removeService', serviceName, config);
            debug('removeService', {clientId, serviceName, config, services: this.services});
        }
    }

    getConfigByServiceName(serviceName) {
        return this.services[serviceName];
    }
}

module.exports = Storage;