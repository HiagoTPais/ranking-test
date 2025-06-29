/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('points', function (table) {
        table.increments('id').primary();
        table.integer('employee_id').unsigned().notNullable();
        table.integer('amount').notNullable();
        table.text('reason').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('employee_id').references('id').inTable('employees').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('points');
};