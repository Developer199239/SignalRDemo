const http = require("http");
const signalR = require("@microsoft/signalr");

const server = http.createServer();
const hub = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5285/signalhub")
  .build();

hub.on("ReceiveMessage", (message) => {
  console.log(`ReceiveMessage: ${message}`);
});

hub.on("ReceiveEmployee", (employee) => {
  console.log(`ReceiveEmployee: ${employee.name}`);
});

hub.onclose(() => {
  console.log("Connection closed");
});

hub
  .start()
  .then(() => {
    console.log("SignalR server started.");
  })
  .catch((err) => {
    console.error(err);
  });

server.listen(5000, () => {
  console.log("Server started listening on port 5000.");
});

// Send messages to the SignalR hub
// setInterval(() => {
//   hub.invoke("ReceiveMessage", "Server").catch((err) => console.error(err));
// }, 5000);

// Send messages to the SignalR hub
setInterval(() => {
  const options = {
    hostname: "localhost",
    port: 5285,
    path: "/Home/PushMessage?message=Hello%20World!",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.end();
}, 5000);
