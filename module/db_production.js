require("./env")
global.Sequelize = require('sequelize');
global.Op = Sequelize.Op;

var config = require("./config")["production"]
global.dbOptions = config.aws.rds;
if (!global.sequelize) {
  global.sequelize = new Sequelize(config.aws.rds.database, config.aws.rds.user, config.aws.rds.password, {
    host: config.aws.rds.host,
    dialect: config.aws.rds.dbtype,
    port: config.aws.rds.port,
    define: {
      timestamps: false,
      dialectOptions: {
        timezone: config.aws.rds.timezone,
        // useUTC: false,
        dateStrings: true,
        connectTimeout: 60000
      },
    },

    timezone: config.aws.rds.timezone,
    logging: false,

    pool: config.aws.rds.pool

  });
}


// require("./model")
var path = require("path")
var fs = require("fs")
var modelsPath = path.join(__dirname, "../models")

var hashFile = path.join(modelsPath, "../", "hash")
var hashFiles = require('hash-files');
var hash = hashFiles.sync({
  files: [modelsPath + "/*.js"]
})
requireModels();

function requireModels() {
  var files = fs.readdirSync(modelsPath)
  files.forEach(item => {
    if (item.indexOf(".js") > -1) {
      require(path.join(modelsPath, item))
    }
  })

}
