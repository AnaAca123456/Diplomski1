import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["korisnik", "mentor", "advokat", "admin"],
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        photo: {
            type: String, 
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
        },

        // Samo za advokate
        licenseNumber: {
            type: String,
        },

        // Samo za mentore
        companyNames: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
