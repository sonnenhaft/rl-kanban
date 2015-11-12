module.exports = function(event) {
    console.log('[' + event.type + '] file ' + event.path);  // jshint ignore:line
};