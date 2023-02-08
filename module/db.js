require("./env")
global.Sequelize = require('sequelize');
global.Op = Sequelize.Op;


// var config = require("./config")["develop"]
global.dbOptions = config.aws.rds;
console.log(dbOptions)
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


var path = require("path")
var fs = require("fs")
var modelsPath = path.join(__dirname, "../models")

var hashFile = path.join(modelsPath, "../", "hash")
var hashFiles = require('hash-files');

var hash = hashFiles.sync({
  files: [modelsPath + "/*.js"]
})
requireModels();


(async () => {
  if (!fs.existsSync(hashFile)) {
    alter()

  } else {
    var oldHash = fs.readFileSync(hashFile).toString()
    if (oldHash != hash) {
      alter()
    }
  }
})()
async function alter() {
  console.log("alter start..")
  await sequelize.sync({
    alter: {
      drop: false
    }
  })
  console.log("alter finish!")
  fs.writeFileSync(hashFile, hash)
}
function requireModels() {
  var files = fs.readdirSync(modelsPath)
  files.forEach(item => {
    if (item.indexOf(".js") > -1) {
      require(path.join(modelsPath, item))
    }
  })
  // require(path.join(modelsPath, "relation.js"))

}
