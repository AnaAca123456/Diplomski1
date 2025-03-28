import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["poslovnaIdeja", "postojecePreduzece"],
            required: true,
        },

        title: String, 
        companyName: String,

        ideaDescription: String,
        targetAudience: String,
        competition: String,
        resources: String,
        incomeSource: String,
        promotion: String,
        salesStrategy: String,
        plannedCosts: String,
        incomeForecast: String,
        timeline: String,
        employees: String,
        businessPlanFile: String, 

        // Postojeće preduzeće
        companyDescription: String,
        location: String,
        contactPhone: String,
        website: String,

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        ratings: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                value: { type: Number, min: 1, max: 5 }
            }
        ],


        legalStatus: {
            type: String,
            enum: ["legal", "illegal", "unspecified"],
            default: "unspecified",
        },

    },
    { timestamps: true }
);

export default mongoose.model("Post", postSchema);
