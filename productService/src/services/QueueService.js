import amqplib from "amqplib"
import ProductService from './ProductService.js'

class QueueService {
    async consume() {
        const connection = await amqplib.connect(process.env["RMMQ_CONNECT_STIRNG"])

        const channel = await connection.createChannel()

        const isDevelopment = process.env["NODE_ENV"] === "development"  

        const queue = isDevelopment ? process.env["QUEUE"] : "TestProductQueue"

        const cartQueue = isDevelopment ? process.env["CART_QUEUE"] : "TestCartQueue"

        const orderQueue = isDevelopment ? process.env["ORDER_QUEUE"] : "TestOrderQueue"

        await channel.assertQueue(queue, {
            durable: isDevelopment, // The queue won't be lost if the RabbitMQ server goes down.
        })

        channel.consume(queue, async(msg) => {
            const msgContent = JSON.parse(msg.content.toString())

            if (msgContent.event === "dropStock") {
                try {
                    await ProductService.dropStock(msgContent.productID, msgContent.productAmount) 
                    channel.sendToQueue(orderQueue, Buffer.from(JSON.stringify({...msgContent, event: "approveOrder"})))
                } catch (error) {
                    channel.sendToQueue(cartQueue, Buffer.from(JSON.stringify({...msgContent, event: "restoreCart"})))
                }
                channel.ack(msg)
            }
        }, {noAck: false})
    }
}

export default new QueueService();
