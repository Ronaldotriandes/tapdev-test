const fs = require('fs');
const path = require('path');

const routes = {};

fs.readdirSync(__dirname).forEach((file) => {
    console.log(__dirname)
    if (file !== 'index.js' && file.endsWith('.js')) {
        const moduleName = path.basename(file, '.js');
        routes[moduleName] = require(path.join(__dirname, file));
        console.log(routes[moduleName]);
    }
});

module.exports = routes;
