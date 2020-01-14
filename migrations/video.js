'use strict';
exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('video', function (table) {
            table.increments('id').primary();
            table.text('video_id');
            table.text('title');
            table.datetime('date');
            table.text('channel_id');
            table.text('published_at');
            table.text('page_token');
        });
};
exports.down = function (knex) {
    return knex.schema
        .dropTable('video');
};