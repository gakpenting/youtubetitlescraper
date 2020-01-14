'use strict';
var bookshelf = require('../bookshelf');
var Contact = bookshelf.Model.extend({
    tableName: 'channel',
});
module.exports = Contact;