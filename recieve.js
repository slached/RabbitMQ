var amqp = require("amqplib/callback_api");

amqp.connect(process.env.RABBIT_MQ_URI, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const exchange = "animals";
    // in console we specify binding names that queue have
    const routes = process.argv.slice(2);
    
    channel.assertExchange(exchange, "topic", {
      durable: true,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

        routes.forEach((route_key) => {
          channel.bindQueue(q.queue, exchange, route_key);
        });

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.content) {
              console.log(" [x] %s", msg.content.toString());
            }
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
