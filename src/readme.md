## ✅ _Project Setup Summary & Flow_

---

### 🔰 1. _Project Initialization_

- Ran npm init to create package.json
- Installed dependencies:

  - Core: express, mongoose, dotenv, jsonwebtoken, bcrypt
  - Dev: nodemon, prettier, etc.

---

### 🗂 2. _Project Structure_

"app.js","index.js",".env",".env.sample" | ForEach-Object { New-Item $_ -ItemType File}
'controllers','db','middlewares','models','routes','utils' | ForEach-Object { mkdir $_ }

src/
│
├── config/ → .env, constants.js
├── db/ → MongoDB connection (index.js)
├── models/ → Mongoose schemas + methods/hooks
├── controllers/ → Route logic (optional here)
├── routes/ → API routing
├── middlewares/ → Error handlers, auth middlewares
├── utils/ → Helpers like asyncHandler, apiError
├── app.js → Main Express app
└── index.js → Server entry point

---

### 🧹 3. _Code Formatting_

- Created .prettierrc and .prettierignore for consistent code styling.

---

### 🌐 4. _Environment Configuration_

- .env for storing:

  PORT=5000
  MONGO_URI=
  ACCESS_TOKEN_SECRET=
  REFRESH_TOKEN_SECRET=

---

### 🔌 5. _Database (db/index.js)_

- Connected to MongoDB using mongoose.connect()
- Used try-catch with proper error handling
- Exported the connection function

---

### ⚙ 6. _Utils Folder_

- asyncHandler.js: Wraps async functions to catch errors and forward them
- apiError.js: Custom error class for readable API errors
- apiResponse.js: Sends structured responses (success/failure)

---

### 🧠 7. _Models (user.js, etc.)_

- Defined Mongoose schemas
- Added plugin: mongoose-aggregate-paginate to handle large datasets
- JWT logic added inside userModel:

  - _Hooks_:

    - pre("save") to hash password

  - _Methods_:

    - isPasswordCorrect()
    - generateAccessToken()
    - generateRefreshToken()

---

### 🔒 8. _JWT Auth Flow_

- Access & Refresh tokens handled in the model (close to data)
- No JWT logic in controller → better encapsulation and reusability

---

### ✅ Suggestions for Improvement

- Add routes/ and controllers/ for modular REST APIs
- Add validation using Joi or express-validator
- Use helmet, cors, rate-limit for security

cookie-parser
multer -multipart form data

---

user.routes created to handle upload of avatar and banner using multer whose logic is in multer middleware

then route is created in app.js where method in user.routes is called and its logic is in user.controller

cloudinary.js for cloudinary handling and created middlewares multer.middlewares for image uploading task and error.middlewares for handling it

user.controllers.js handles main logic of CRUD operations
user.controllers->user.routes->app.js

adding user login feature in user controller

_Middleware_ is a reusable block of code in Express that runs _between the request and response, often used to \*\*decode, validate, or modify_ data (like decoding tokens, checking auth, or logging).

written auth middleware which decodes the user through token recieved and then user.routes.js we add logout route in which we add this middleware and then controller inside route statement.
here in middleware next() is used to pass control from middleware to other middleware or controller

added more controller features like update password ,coverimage ,avatar extra

added monogdb aggregation pipeline features to fecth data from the user datatbase and display it in backend

created dedicated routes for each feature and testing on postman
