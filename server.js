const express = require("express");
const cors = require("cors");

class Server {
    constructor(port) {
        this.port = port;
        this.app = express();
    }

    startServer() {
        return new Promise((resolve, _reject) => {
            // Middleware
            this.app.use(cors());
            this.app.use(express.json());

            // Endpoints
            this.app.use('/people', require("./routes/people"));
            this.app.use('/planets', require("./routes/planets"));

            this.app.listen(this.port, () => {
                resolve();
            })
        })
    }
}

module.exports = Server;