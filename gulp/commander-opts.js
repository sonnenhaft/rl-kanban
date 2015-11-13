var commander = require('commander');

commander
    .option('--no-color').option('--gulpfile')
    .option('--lrport [port number]', 'Live reload port', 35729)
    .option('--eport [port number]', 'express server port', 4000)
    .option('--hostname [host name]', 'host name', 'localhost')
    .option('--versioned', 'add version numbers to compiled .js and .css files')
    .parse(process.argv);

module.exports = commander;