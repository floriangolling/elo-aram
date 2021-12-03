const Sequelize = require('sequelize');

class Match extends Sequelize.Model {
    static definition(sequelize) {
        Match.init({
            matchID: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            matchInfos: {
                type: Sequelize.DataTypes.JSON,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: "match"
        });
    }

    static associate() {
    }
}

module.exports = Match