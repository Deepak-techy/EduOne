import dotenv from "dotenv";
import connectDB from "./config/database.config.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

connectDB()
    .then(() => {
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