const Sequelize = require('sequelize');
const Match     = require('./match')
const UserMatch = require('./user_match')

class User extends Sequelize.Model {
    static definition(sequelize) {
        User.init({
            username: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            puuid: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            elo: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: 1200
            },
            winrate: {
                type: Sequelize.FLOAT,
                defaultValue: 100
            },
            games: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            wins: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: "user"
        });
    }

    static associate() {
        Match.belongsToMany(User, { through: UserMatch });
        User.belongsToMany(Match, { through: UserMatch });
    }
}

module.exports = User