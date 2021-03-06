/*globals */
'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function ({ app, data, database, upload, auth, grid, encryption, userMiddleware }) {

    fs.readdirSync(__dirname)
        .filter(x => x.includes('-router'))
        .forEach(file => {
            require(path.join(__dirname, file))({ app, data, database, upload, auth, grid, encryption, userMiddleware });
        });

    app.get('*', (req, res) => {
        res.redirect('/home/error');
    });
};