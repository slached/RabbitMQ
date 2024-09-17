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
    var msg = process.argv.slice(2).join(" ") || "Hello World!";
    // if durable true queue not deleted
    // although rabbit crashes
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      // if persistent true messages not deleted
      // although rabbit crashes
      persistent: true,
    });

    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
