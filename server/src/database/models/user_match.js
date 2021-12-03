const Sequelize = require('sequelize');

class UserMatch extends Sequelize.Model {
    static definition(sequelize) {
        UserMatch.init({
        }, {
            sequelize,
            tableName: "user_match",
        });
    }

    static associate() {
    }
}

module.exports = UserMatch