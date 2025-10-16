const fs = require('fs');
const path = require('path');

const repositories = {};

fs.readdirSync(__dirname).forEach((file) => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const moduleName = path.basename(file, '.js');
        repositories[moduleName] = require(path.join(__dirname, file));
    }
});

module.exports = repositories;
