'use strict';
exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('remove_word', function (table) {
            table.increments('id').primary();
            table.string('real_word');
            table.string('word');
            table.string("language")

        });
};
exports.down = function (knex) {
    return knex.schema
        .dropTable('remove_word');
};