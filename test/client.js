/**
 * Created by Z on 2017-03-07.
 */
const SocketCli = require('../lib/SocketCli');

const cli = new SocketCli();

cli.connect('ws://localhost:9005');

cli.registe('/cds/demo', {'name': 'name'});