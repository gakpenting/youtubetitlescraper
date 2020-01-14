'use strict';
exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('user', function (table) {
            table.increments('id').primary();
            table.string('username');
            table.string('pass');

        });
};
exports.down = function (knex) {
    return knex.schema
        .dropTable('user');
};