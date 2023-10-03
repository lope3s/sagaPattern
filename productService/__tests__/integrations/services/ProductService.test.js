import "dotenv/config"
import {describe, it, before, after} from "node:test"
import assert from "node:assert"
import ProductService from '../../../src/services/ProductService.js'
import knex from "knex"
import knexConfig from "../../../knexfile.js"

describe("Testing ProductService", async() => {
    const db = knex(knexConfig["testing"])

    before(async() => {
            await db.migrate.latest()
    })

    after(async() => {
        await db.migrate.rollback(undefined, true)
        await db.destroy()
        process.exit(0)
    })

    it("Should not drop product stock bellow 0", async() => {
        try {
           await ProductService.dropStock(1, 10) 

            assert.fail("Should have thrown an Error")
        } catch (error) {
           assert.strictEqual(error.message, "Can't drop stock bellow 0")
           assert.strictEqual(error.name, "Error")
        }
    })

    it("Should increase product stock by the amount provided", async() => {
        await ProductService.addStock(1, 10) 
        
        const [updatedProduct] = await db.raw("SELECT * FROM products WHERE id = 1;")

        assert.strictEqual(updatedProduct.stock, 11)
    })
})
