import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/mongoDB.config.js";
import { connectQdrant } from "./config/qdrant.config.js";
import { connectOllama } from "./config/ollama.config.js";
import { initSocket } from "./config/socket.config.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

// create HTTP server and attach Socket.IO
const server = createServer(app);
initSocket(server);

connectDB()
    .then(async () => {
        // Connect to Qdrant after MongoDB is connected
        await connectQdrant();
        await connectOllama();

        server.listen(process.env.PORT, () => {

            server.on("error", (err) => {
                console.error("ERROR", err);
                throw err;
            });

            console.log(`Server is running on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION ERROR: ", err);

    })