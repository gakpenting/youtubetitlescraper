'use strict';
var bookshelf = require('../bookshelf');
var Contact = bookshelf.Model.extend({
    tableName: 'count_string',
});
module.exports = Contact;