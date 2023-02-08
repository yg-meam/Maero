global.ENV = "production"
global.config = require("./config")["development"];
global.Sequelize = require('sequelize');
global.Op = Sequelize.Op;

global.dbOptions = config.aws.rds;
global.sequelize = new Sequelize(config.aws.rds.database, config.aws.rds.user, config.aws.rds.password, {
  host: config.aws.rds.host,
  dialect: 'mariadb',
  define: {
    timestamps: false
  },
  dialectOptions: {
    timezone: 'Etc/GMT-9',
  },
  timezone: 'Etc/GMT-9',
  logging: false,
  pool: config.aws.rds.pool

});
require("./model")
