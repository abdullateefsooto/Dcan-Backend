// Takes a function (usually a controller) as an argument
const asyncHandler = (fn) => (req, res, next) => {
  // Wrap the function in Promise.resolve to handle both sync and async errors
  Promise.resolve(fn(req, res, next))
    // If an error occurs, pass it to Express' next() for centralized error handling
    .catch(next);
};

module.exports = asyncHandler;
