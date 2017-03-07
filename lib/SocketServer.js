/**
 * Created by Z on 2017-03-07.
 */
const Io = require('socket.io');

const SocketCli = require('./SocketCli');

class SocketServer {
    constructor(port) {
        this.port = port || 9004;
        this.server = new Io();
        this.server.on('connect', (socket) => {
            new SocketCli().init.bind(socket)();
        });
    }

    listen() {
        this.server.listen(this.port);
    }
}

module.exports = SocketServer;