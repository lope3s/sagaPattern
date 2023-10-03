import knex from "knex";
import knexConfig from "../../knexfile.js";

class ProductService {
    /**
        * Drops product stock only if it wouldn't drop it bellow 0.
        * @param {number} productID - Product ID.
        * @param {number} stockQuantityToDrop - The number of units to drop in the stock.
        * @returns Promise<number> - The ID of the updated product.
    */
    #TABLE_NAME = "products";

    getDb() {
        const db = knex(knexConfig[process.env["NODE_ENV"] || "development"])

        return db
    }

    async dropStock(productID, stockQuantityToDrop) {
        const db = this.getDb()

        const [product] = await db.raw("SELECT * FROM ?? WHERE id = ?;", [this.#TABLE_NAME, productID])

        if (product.stock < stockQuantityToDrop) {
            throw new Error("Can't drop stock bellow 0")
        }

        await db.raw("UPDATE ?? SET stock = stock - ? WHERE id = ?;", [this.#TABLE_NAME, stockQuantityToDrop, productID])

        await db.destroy()
    }

    async addStock(productID, stockQuantityToDrop) {
        const db = this.getDb()

        await db.raw("UPDATE ?? SET stock = stock + ? WHERE id = ?;", [this.#TABLE_NAME, stockQuantityToDrop, productID])

        await db.destroy()
    }
}

export default new ProductService();
