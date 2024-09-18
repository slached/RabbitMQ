const amqp = require("amqplib/callback_api");

amqp.connect(process.env.RABBIT_MQ_URI, function (error0, connection) {
  if (error0) throw new Error(error0);

  connection.createChannel(function (error1, channel) {
    if (error1) throw new Error(error1);
    const exchange = "animals";
    const msg = process.argv[2] || "Hello World!";
    const route_type = process.argv.slice(3).join(" ");
    
    // it's just publish all messages that receive to all bounded queue's
    channel.assertExchange(exchange, "topic", { durable: true });

    // The empty string as second parameter means that
    // we don't want to send the message to any specific queue.
    // We want only to publish it to our 'logs' exchange.
    channel.publish(exchange, route_type, Buffer.from(msg));

    console.log(` [x]  Sent ${msg}`);
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
