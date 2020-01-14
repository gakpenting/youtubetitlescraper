'use strict';
exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('channel', function (table) {
            table.increments('id').primary();
            table.text('title');
            table.text('channel_url');
            table.text('channel_id');
            table.text('published_at');
            table.text('page_token');
            table.text('username');
            table.text('total_video');
        });
};
exports.down = function (knex) {
    return knex.schema
        .dropTable('channel');
};