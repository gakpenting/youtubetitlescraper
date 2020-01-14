'use strict';
var bookshelf = require('../bookshelf');
var Contact = bookshelf.Model.extend({
    tableName: 'queue',
});
module.exports = Contact;