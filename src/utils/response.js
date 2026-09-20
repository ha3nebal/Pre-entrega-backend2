export const sendSuccess = (res, payload, status = 200) => {

    return res.status(status).json({
        status: "success",
        payload
    });

};

export const sendError = (res, message, status = 500) => {

    return res.status(status).json({
        status: "error",
        message
    });

};