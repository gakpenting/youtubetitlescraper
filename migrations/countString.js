'use strict';
exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('count_string', function (table) {
            table.increments('id').primary();
            table.text('video_id');
            table.text('channel_id');
            table.text('real_word');
            table.text('word');
            table.text('count');
        });
};
exports.down = function (knex) {
    return knex.schema
        .dropTable('count_string');
};