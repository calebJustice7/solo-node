const Server = require("./server");
const PORT_NUM = 3000;

let server = new Server(PORT_NUM);

server.startServer()
    .then(() => {
        console.log(`Server running on port ${PORT_NUM}`);
    })
    .catch((e) => {
        console.log(`Error starting server: ${e.message}`);
    })