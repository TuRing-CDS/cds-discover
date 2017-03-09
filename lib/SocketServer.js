/**
 * Created by Z on 2017-03-07.
 */
const Io = require('socket.io');

const SocketCli = require('./SocketCli');

const debug = require('./utils').debug('Discover-Server');

class SocketServer {
    constructor(port, discover) {
        this.port = port || 9004;
        this.server = new Io();
        this.discover = discover;
        this.server.on('connect', (socket) => {
            socket.server = this;
            new SocketCli().init.bind(socket)(discover.storage);
            socket.emit('syncServers', Object.keys(discover.storage.clients));
            Object.keys(discover.storage.services).forEach((key) => {
                let set = discover.storage.services[key];
                set.forEach((config) => {
                    socket.emit('addService', key, config);
                })
            })
        });
    }

    listen() {
        this.server.listen(this.port);
        debug('Running at port', this.port)
    }
}

module.exports = SocketServer;