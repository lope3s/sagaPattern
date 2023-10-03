import "dotenv/config"
import {describe, it, before, after} from "node:test"
import assert from "node:assert"
import QueueService from "../../../src/services/QueueService.js"
import amqplib from "amqplib"
import knex from "knex"
import knexConfig from "../../../knexfile.js"

describe("Testing QueueService", async() => {
    const db = knex(knexConfig["testing"])
    let connection;
    let channel;

    before(async() => {
        connection = await amqplib.connect(process.env["RMMQ_CONNECT_STIRNG"])

        channel = await connection.createChannel()

        await Promise.all([
            channel.assertQueue("TestProductQueue", {
                durable: false 
            }),
            channel.assertQueue("TestOrderQueue", {
                durable: false
            }),
            channel.assertQueue("TestCartQueue", {
                durable: false
            })
        ])

        await db.migrate.latest()

        await QueueService.consume()
    })

    after(async() => {
        await db.migrate.rollback(undefined, true)

        if (connection && channel) {
            await channel.close()
           await connection.close();
        }

        process.exit(0)
    })
    
    it("Should receive a dropStock event and emit a restoreCart evento to cart service as the product can't be droped.", async() => {
        const payload = {event: 'dropStock', productID: 1, productAmount: 99, cartID: 1, orderID: 1}
        channel.sendToQueue('TestProductQueue', Buffer.from(JSON.stringify(payload)))

        await new Promise((resolve) => setTimeout(() => resolve(null), 250))

        const [product] = await db.raw("SELECT * FROM products WHERE id = 1")
        assert.strictEqual(product.stock, 1)

        const message = await channel.get("TestCartQueue", {noAck: true})
        assert.deepStrictEqual(JSON.parse(message.content.toString()), {...payload, event: "restoreCart"})
    })

    it("Should receive a dropStock event and emit an approveOrder event after droping proudct stock.", async() => {
        const payload = {event: 'dropStock', productID: 1, productAmount: 1, cartID: 1, orderID: 1}
        channel.sendToQueue('TestProductQueue', Buffer.from(JSON.stringify(payload)))

        await new Promise((resolve) => setTimeout(() => resolve(null), 250))

        const [product] = await db.raw("SELECT * FROM products WHERE id = 1")
        assert.strictEqual(product.stock, 0)

        const message = await channel.get("TestOrderQueue", {noAck: true})
        assert.deepStrictEqual(JSON.parse(message.content.toString()), {...payload, event: "approveOrder"})
    })
})
