'use strict';
var knex = require('knex')(require('./knexfile').development);
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(require('bookshelf-simplepaginate'));
module.exports = bookshelf;