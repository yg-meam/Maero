global.ENV = process.env.DEPLOYMENT_GROUP_NAME || process.env.NODE_ENV || "development";
console.log(ENV)

global.config = require("./config")[ENV];
