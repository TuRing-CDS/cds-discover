/**
 * Created by Z on 2017-03-07.
 */
const SocketServer = require('../lib/SocketServer');

const server = new SocketServer(9005);

server.listen();