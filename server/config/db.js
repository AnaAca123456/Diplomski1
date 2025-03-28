import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" MongoDB konektovan");
    } catch (err) {
        console.error(" Greška pri konekciji:", err.message);
        process.exit(1);
    }
};

export default connectDB;
