/**
 * Created by Z on 2017-03-08.
 */

// module.exports.debug = function (nameSpace) {
//     return function () {
//         console.log.apply(null, [`[${(nameSpace)}]`, new Date()].concat([].slice.apply(arguments).map((item) => {
//             return 'object' === typeof(item) ? JSON.stringify(item) : item;
//         })))
//     }
// }

module.exports.debug = require('debug');