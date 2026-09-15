export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Error interno del servidor";

    if (err.name === "CastError") {
        statusCode = 400;
        message = "El identificador proporcionado no es válido.";
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Los datos proporcionados no son válidos.";
    }

    if (err.code === 11000) {
        statusCode = 409;
        message = "El recurso ya existe.";
    }

    res.status(statusCode).json({
        status: "error",
        message
    });
    
};