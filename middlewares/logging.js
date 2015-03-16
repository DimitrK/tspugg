/**
 * Middleware which listens for application domain errors and logs them through winston
 *
 * @param {Object} req The incoming request
 * @param {Object} res The response about to send
 * @param {Function} next Pass control to the next handler
 */
function errorHandlerMiddleware(error, request, response, next) {
    request.app.get('logger').error('Error on request %d %s %s: %j', process.domain.id, request.method, request.url, error);
    if (request.xhr) {
        response.status(error.status || 500).json("Boom! Something bad happened. :( ");
      } else {
        next(error);
      }
}

/**
 * Middleware which logs the incoming requests through winston logger
 *
 * @param {Object} req The incoming request
 * @param {Object} res The response about to send
 * @param {Function} next Pass control to the next handler
 */
function requestLoggerMiddleware(request, response, next) {
    // log each request to the console
    request.app.get('logger').info(request.method, request.url);
    next();

}

module.exports = {
    request: requestLoggerMiddleware,
    error: errorHandlerMiddleware
};

