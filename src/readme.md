Project Setup Summary & Flow
This document outlines the setup and flow of a Node.js/Express backend application for user authentication and profile management. It uses MongoDB for data storage, JWT for authentication, Cloudinary for image uploads, and Mongoose for database interactions. Follow these steps to understand and rebuild the project from scratch.

🔰 1. Project Initialization
Purpose: Set up the project foundation with Node.js and necessary dependencies.

Run npm init -y to create a package.json file.
Install core dependencies for the application:npm install express mongoose dotenv jsonwebtoken bcrypt cookie-parser multer cloudinary mongoose-aggregate-paginate-v2


Install development dependencies for easier development:npm install --save-dev nodemon prettier


Update package.json with scripts:"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}




🗂️ 2. Project Structure
Purpose: Organize the codebase for modularity and maintainability.
Create the following files and directories in the project root:
# Files
touch src/app.js src/index.js src/.env src/.env.sample

# Directories
mkdir src/config src/db src/models src/controllers src/routes src/middlewares src/utils

Structure Overview
src/
│
├── config/                  # Environment variables and constants
│   ├── .env                # Sensitive configurations (e.g., API keys)
│   └── .env.sample         # Template for .env
├── db/                     # Database connection logic
│   └── index.js            # MongoDB connection setup
├── models/                 # Mongoose schemas and models
│   └── user.models.js      # User schema with methods/hooks
├── controllers/            # Business logic for API endpoints
│   └── user.controller.js  # User-related CRUD operations
├── routes/                 # API route definitions
│   └── user.routes.js      # User-related routes
├── middlewares/            # Reusable middleware functions
│   ├── auth.middlewares.js # JWT authentication
│   ├── multer.middlewares.js # File upload handling
│   └── error.middlewares.js # Error handling (optional)
├── utils/                  # Helper utilities
│   ├── asyncHandler.js     # Async error handling wrapper
│   ├── apiError.js         # Custom error class
│   ├── apiResponse.js      # Structured API response
│   └── cloudinary.js       # Cloudinary upload/delete logic
├── app.js                  # Express app setup
├── index.js                # Server entry point
├── .prettierrc             # Prettier configuration
└── .prettierignore         # Files ignored by Prettier


🧹 3. Code Formatting
Purpose: Ensure consistent code style across the project.

Create .prettierrc for code formatting:{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}


Create .prettierignore to exclude files:node_modules
.env
package-lock.json



Run npx prettier --write . to format all files.

🌐 4. Environment Configuration
Purpose: Store sensitive configurations securely.

Create .env in src/ with the following:PORT=5000
MONGO_URI=mongodb://localhost:27017/your-db
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=development


Create .env.sample as a template (exclude sensitive values):PORT=
MONGO_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=


Use dotenv in app.js to load environment variables:import dotenv from 'dotenv';
dotenv.config();




🔌 5. Database Setup (db/index.js)
Purpose: Connect to MongoDB for data persistence.

Create src/db/index.js to establish a MongoDB connection using Mongoose:import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;


Call connectDB in index.js to initialize the database connection.


⚙️ 6. Utilities (utils/)
Purpose: Create reusable helper functions for error handling, responses, and Cloudinary integration.

asyncHandler.js: Wraps async route handlers to catch errors:const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export default asyncHandler;


apiError.js: Custom error class for consistent error responses:class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
export default ApiError;


apiResponse.js: Structured response format for API success:class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
export default ApiResponse;


cloudinary.js: Handles image uploads/deletions with Cloudinary:import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    return response;
  } catch (error) {
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};




🧠 7. Models (models/user.models.js)
Purpose: Define the user schema and methods for authentication.

Create src/models/user.models.js with Mongoose schema, hooks, and methods:import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  coverImage: { type: String },
  refreshToken: { type: String },
  watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

userSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model('User', userSchema);




🔒 8. Authentication Flow
Purpose: Implement secure JWT-based authentication.

Registration:
Validate input fields (fullname, email, username, password).
Upload avatar/cover images to Cloudinary using Multer.
Hash password (via Mongoose pre hook).
Save user to MongoDB.


Login:
Validate credentials.
Verify password using isPasswordCorrect.
Generate access and refresh tokens using model methods.
Store refresh token in the database and set tokens in HTTP-only cookies.


Protected Routes:
Use auth.middlewares.js to verify JWT:import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.models.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer', '').trim();
    if (!token) throw new ApiError(401, 'Unauthorized');
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select('-password -refreshToken');
    if (!user) throw new ApiError(401, 'Invalid token');
    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};




Token Refresh:
Validate refresh token and generate new access/refresh tokens.


Logout:
Clear refresh token from the database and cookies.




🛤️ 9. Routes and Controllers
Purpose: Define API endpoints and their logic.

Routes (routes/user.routes.js):
Define endpoints using Express Router.
Use Multer for file uploads and verifyJWT for protected routes.
Example: router.route('/register').post(upload.fields([...]), registerUser);


Controllers (controllers/user.controller.js):
Handle business logic (e.g., user registration, login, profile updates).
Use asyncHandler to manage async errors.
Example: Register user, upload images, save to database, return response.




📤 10. File Uploads with Multer and Cloudinary
Purpose: Handle image uploads for user avatars and cover images.

Create middlewares/multer.middlewares.js:import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });


Use in routes for avatar/cover image uploads.
Upload files to Cloudinary and store URLs in the database.


📊 11. MongoDB Aggregation Pipelines
Purpose: Fetch complex user data efficiently.

Channel Profile: Use aggregation to get subscriber counts and subscription status:
Match user by username.
Lookup subscribers and subscribed-to channels.
Add fields for counts and subscription status.


Watch History: Fetch videos with owner details using nested lookups.
Example in getUserChannelProfile and getWatchHistory controllers.


🛠️ 12. App Setup (app.js and index.js)

app.js: Configure Express, middlewares, and routes:import express from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/users', userRouter);
export default app;


index.js: Start the server and connect to MongoDB:import app from './app.js';
import connectDB from './db/index.js';

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});




🧪 13. Testing with Postman
Purpose: Verify API functionality.

Use Postman to test endpoints (e.g., /register, /login, /history).
Set headers for Authorization (Bearer token) in protected routes.
Test file uploads with multipart/form-data.


✅ 14. Suggestions for Improvement

Validation: Add Joi or express-validator for input validation.
Security:
Use helmet for secure headers.
Enable cors with strict origins.
Add rate-limit to prevent abuse.


Testing: Implement Jest and Supertest for unit tests.
Logging: Use winston or morgan for request logging.
Documentation: Generate API docs with Swagger.


🔄 Flow Summary

User Request: Client sends a request to an endpoint (e.g., /register).
Routing: user.routes.js directs the request to the appropriate controller.
Middleware: Multer handles file uploads, verifyJWT checks authentication.
Controller: Executes logic (e.g., validate input, upload images, save user).
Model: Interacts with MongoDB (e.g., save user, generate tokens).
Response: Returns structured apiResponse or throws apiError.

This modular flow ensures scalability and maintainability, with clear separation of concerns.

