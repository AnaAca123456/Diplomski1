export const errorHandler = (err, req, res, next) => {
    console.error(" Greška:", err.stack);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);

    res.json({
        message: err.message || "Došlo je do greške.",
        stack: process.env.NODE_ENV === "development" ? err.stack : "🥷",
    });
};
