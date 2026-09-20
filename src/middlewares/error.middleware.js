export const errorHandler = (err, req, res, next) => {

    res.status(err.statusCode || 500).json({

        status: "error",

        message: err.message || "Error interno del servidor"

    });

};