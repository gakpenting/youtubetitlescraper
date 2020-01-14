'use strict';
exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('queue', function (table) {
            table.increments('id').primary();
            table.text('channel_id');
            table.text('username');
            table.text('completed');
            table.text('ongoing');
            table.text('autoOrManual');
            table.text('pageToken');
            table.timestamp('created_at').defaultTo(knex.fn.now())

        });
};
exports.down = function (knex) {
    return knex.schema
        .dropTable('queue');
};