const fs = require('fs');
const path = require('path');

const controllers = {};

fs.readdirSync(__dirname).forEach((file) => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const moduleName = path.basename(file, '.js');
        controllers[moduleName] = require(path.join(__dirname, file));
    }
});

module.exports = controllers;
