import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {

    await connectDB();

    app.listen(config.PORT, () => {

        console.log(`Servidor ejecutándose en puerto ${config.PORT}`);

    });

};

startServer();