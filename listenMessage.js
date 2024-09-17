var amqp = require("amqplib/callback_api");

amqp.connect(process.env.RABBIT_MQ_URI, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = "task_queue";

    // if durable true queue and messages not deleted
    // although rabbit crashes
    channel.assertQueue(queue, {
      durable: true,
    });
    // one consumer only takes one message at once till message acknowledgment is finish
    channel.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      function (msg) {
        const secs = msg.content.toString().split(".").length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(() => {
          console.log("Done");
          // we send manual ack for rabbit gets job is done
          try {
            channel.ack(msg);
          } catch (error) {
            channel.nack(error);
          }
        }, secs * 1000);
      },
      {
        // manual acknowledgment mode,
        noAck: false,
      }
    );
  });
});
