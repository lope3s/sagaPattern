package rabbitmq

import (
    "os"
    "log"
    "errors"
    "time"
    "context"
    "encoding/json"
    "fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

type EventBody struct {
    CartID int `json:"cartID"`
    ProductID int `json:"productID"`
    OrderID int `json:"orderID"`
}

func GetRMQConnection() (*amqp.Channel, error) {
    connection, err := amqp.Dial(os.Getenv("AMQP_URL"))

    if err != nil {
        log.Fatal("error connecting to rabbitmq", err)
    }

    defer connection.Close()


    if err != nil {
        log.Fatal("error while starting db ", err)
    }


    chann, err := connection.Channel()

    if err != nil {
        log.Fatal("error opening the channel", err)
    }

    queueName := os.Getenv("QUEUE_NAME")

    if queueName == "" {
        return nil, errors.New("empty queue name")
    }

    _, queueErr := chann.QueueDeclare(queueName, true, false, false, false, nil)

    if queueErr != nil {
        log.Fatal("error creating a queue", queueErr)
    }

    return chann, nil
}

func PublishEvent(context context.Context, chann *amqp.Channel, json []byte) error {
    msg := amqp.Publishing{
        DeliveryMode: amqp.Transient,
        Timestamp: time.Now(),
        ContentType: "text/plain",
        Body: json,
    }

    queueName := os.Getenv("QUEUE_NAME")

    if queueName == "" {
        return errors.New("empty queue name")
    }

    producerErr := chann.PublishWithContext(context, "", queueName, false, false, msg)

    if producerErr != nil {
        return producerErr
    }

    return nil
}

func Consume (chann *amqp.Channel) error {
    queueName := os.Getenv("QUEUE_NAME")

    if queueName == "" {
        return errors.New("empty queue name")
    }
    
    delivery, err := chann.Consume(queueName, "", false, false, false, false, nil)

    if err != nil {
        return err
    }

    for msg := range delivery {
        err := msg.Ack(false)
        if err != nil {
            log.Fatal("error while acknowledging msg", err)
        }

        eventBody := EventBody{}

        unmarsErr := json.Unmarshal(msg.Body, &eventBody)

        if unmarsErr != nil {
            log.Fatal("error while unmarshaling msg body", unmarsErr)
        }

        fmt.Printf("msg received: %v\n", eventBody)
    }

    return nil
}
