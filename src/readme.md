Started with npm init and then downloaded dev dependencies like node,mongoose,nodemon,etc
created src folder in each multiple other folders created basic project strcture. Setup env files
1. We created prettierrc and prettierignore files for syntax and code enhancement 
2.Created app,index and constants.js files with main codes also added middlewares their
3.In db folder created index.js file where database connnection was made and all logic is their setup with mongoose was done their.
4.Then in utils folder added error handling and healthcheck code files
1.asyncHandler:To resolve error and pass to next requests
2.apiError :Giving apiError in frontend to user to debug 
3.apiResponse: Giving status of the application to the user on frontend

5.In models folder added model codes of each entities and also added aggregation pipeline plugin for huge amount of datas to be handled 
6.Also then added jwt logic in user model itself as it is more dependent on models so not in controller, made use of Hooks and methods for authentication,refresh and access tokens generation 
