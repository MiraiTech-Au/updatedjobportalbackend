// error response common function
export const errorResponse = (
    res,
    statusCode = 500,
    message = 'Internal server error',
    data = null
) =>
    res.status(statusCode).send({
        status: 0,
        message,
        data,
    });

// success response common function
export const successResponse = (
    res,
    statusCode = 200,
    message = 'Success!',
    data = null
) => {
    console.log('message', message);
    return res.status(statusCode).send({
        status: 1,
        message,
        data,       
    });
};