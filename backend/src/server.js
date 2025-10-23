import dotenv from "dotenv";
import connectDB from "./config/mongoDB.config.js";
import { connectQdrant } from "./config/qdrant.config.js";
import { connectOllama } from "./config/ollama.config.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

connectDB()
    .then(async () => {
        // Connect to Qdrant after MongoDB is connected
        await connectQdrant();
        await connectOllama();

        app.listen(process.env.PORT, () => {

            app.on("error", (err) => {
                console.error("ERROR", err);
                throw err;
            });

            console.log(`Server is running on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION ERROR: ", err);

    })