/**
 * Created by Z on 2017-03-08.
 */
const Discover = require('../lib/Discover');

const disconver = new Discover();

disconver.listen(9006).tryConnect(9005);
