const Sequelize = require('sequelize').Sequelize
const Models    = require('./models/');
const config    = require('../config/config')

const sequelize = new Sequelize(config.DATABASE_HOST);

for (let model of Object.values(Models)) {
    model.definition(sequelize);
}

for (let model of Object.values(Models)) {
    model.associate();
}

module.exports = sequelize