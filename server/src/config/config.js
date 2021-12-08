require('dotenv').config()

const config = {
    LEAGUE_API_KEY: process.env.LEAGUE_API_KEY,
    DATABASE_HOST: process.env.DATABASE_HOST,
    numberofGame: 5
}

module.exports = config;