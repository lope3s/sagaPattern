/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex("products").insert([
        {name: "Product 1", stock: 1},
        {name: "Product 2", stock: 2},
        {name: "Product 3", stock: 3},
        {name: "Product 4", stock: 4},
        {name: "Product 5", stock: 5},
    ])
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.raw("DELETE FROM products WHERE id <= 5");
};
