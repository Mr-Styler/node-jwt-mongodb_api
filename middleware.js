const jwt = require("jsonwebtoken");
const User = require("./models/user");
const AppError = require("./utils/appError");

exports.isAuthenticated = async (req, res, next) => {
    try {
        let token;

        // Get the Authorization header
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is present and starts with 'Bearer '
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]; // Extract the token from the header
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt; // Extract the token from cookies
        }

        // If no token is found, return an error
        if (!token) {
            return next(new AppError('Authorization token missing', 401));
        }

        // Verify the JWT token asynchronously using a promise-based approach
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(user);

        // Attach user information to the request object
        req.user = await User.findById(user.id);
        console.log(req.user);

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        console.log(error);
        next(new AppError("Invalid or expired Token", 401));
    }
};

exports.restrictTo = (roles) => {
    return(req, res, next) => {
        console.log(roles, req.user.role);
        if(!roles.includes(req.user.role)) return next(new AppError(`Access Denied.`, 403))
        next();
    }
};

exports.isAuthorized = (Model, attribute) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id; // Assuming the resource ID is passed in the URL
      const userId = req.user.id; // Assuming the authenticated user's ID is stored in req.user
      
      // Dynamically find the model instance by ID
      const resource = await Model.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if the user is the owner/author of the resource
      if (resource[attribute].toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized action' });
      }

      // User is authorized, proceed
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };
};