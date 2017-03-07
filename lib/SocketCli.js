/**
 * Created by Z on 2017-03-07.
 */
const Client = require('socket.io-client');
const EventEmitter = require('events').EventEmitter;
const debug = console.log;

function onDisconnect() {
    debug('disconnect', this.id);
}

function onRegiste(serviceName, config) {
    debug('registe', this.id, serviceName, config);
}

class SocketCli extends EventEmitter {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.on('disconnect', onDisconnect.bind(this));
        this.on('registe', onRegiste.bind(this));
    }

    connect(uri) {
        this.uri = uri || 'ws://localhost:9004';
        this.client = Client(this.uri);
        this.client.on('connect', () => {
            this.id = this.client.id;
            debug('connect', this.uri);
        });
        this.client.on('disconnect', () => {
            this.emit('disconnect');
        });
    }

    registe(serviceName, config) {
        this.client.emit('registe', serviceName, config);
    }
}

module.exports = SocketCli;