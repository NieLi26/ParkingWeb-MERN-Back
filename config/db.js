import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const DB = await mongoose.connect( process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const url = `${DB.connection.host}:${DB.connection.port}`;
        console.log(`MongoDB conectado en ${url}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


export default dbConnection;