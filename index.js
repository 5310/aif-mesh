(function () {
    try {
        module.exports = require('./aifm-es6.js'); 
        module.exports.v = "es6";
    } catch ( e ) {
        require('traceur-runtime');
        module.exports = require('./aifm-es5.js');   
        module.exports.v = "es5";     
    }
}).call(this);
