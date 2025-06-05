## ✅ **Project Setup Summary & Flow**

---

### 🔰 1. **Project Initialization**

- Ran `npm init` to create `package.json`
- Installed dependencies:

  - Core: `express`, `mongoose`, `dotenv`, `jsonwebtoken`, `bcrypt`
  - Dev: `nodemon`, `prettier`, etc.

---

### 🗂️ 2. **Project Structure**

"app.js","index.js",".env",".env.sample" | ForEach-Object { New-Item $_ -ItemType File}
'controllers','db','middlewares','models','routes','utils' | ForEach-Object { mkdir $_ }

```
src/
│
├── config/        → .env, constants.js
├── db/            → MongoDB connection (index.js)
├── models/        → Mongoose schemas + methods/hooks
├── controllers/   → Route logic (optional here)
├── routes/        → API routing
├── middlewares/   → Error handlers, auth middlewares
├── utils/         → Helpers like asyncHandler, apiError
├── app.js         → Main Express app
└── index.js       → Server entry point
```

---

### 🧹 3. **Code Formatting**

- Created `.prettierrc` and `.prettierignore` for consistent code styling.

---

### 🌐 4. **Environment Configuration**

- `.env` for storing:

  ```
  PORT=5000
  MONGO_URI=
  ACCESS_TOKEN_SECRET=
  REFRESH_TOKEN_SECRET=
  ```

---

### 🔌 5. **Database (db/index.js)**

- Connected to MongoDB using `mongoose.connect()`
- Used try-catch with proper error handling
- Exported the connection function

---

### ⚙️ 6. **Utils Folder**

- `asyncHandler.js`: Wraps async functions to catch errors and forward them
- `apiError.js`: Custom error class for readable API errors
- `apiResponse.js`: Sends structured responses (success/failure)

---

### 🧠 7. **Models (user.js, etc.)**

- Defined Mongoose schemas
- Added plugin: `mongoose-aggregate-paginate` to handle large datasets
- JWT logic added inside `userModel`:

  - **Hooks**:

    - `pre("save")` to hash password

  - **Methods**:

    - `isPasswordCorrect()`
    - `generateAccessToken()`
    - `generateRefreshToken()`

---

### 🔒 8. **JWT Auth Flow**

- Access & Refresh tokens handled in the model (close to data)
- No JWT logic in controller → better encapsulation and reusability

---

### ✅ Suggestions for Improvement

- Add `routes/` and `controllers/` for modular REST APIs
- Add validation using `Joi` or `express-validator`
- Use `helmet`, `cors`, `rate-limit` for security

cookie-parser
multer -multipart form data

---

user.routes created to handle upload of avatar and banner using multer whose logic is in multer middleware

then route is created in app.js where method in user.routes is called and its logic is in user.controller

cloudinary.js for cloudinary handling and created middlewares multer.middlewares for image uploading task and error.middlewares for handling it

user.controllers.js handles main logic of CRUD operations
user.controllers->user.routes->app.js
