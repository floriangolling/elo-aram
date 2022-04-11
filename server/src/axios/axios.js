const axios     = require('axios');
const config    = require('../config/config');

axios.defaults.headers.common['X-Riot-Token'] = config.LEAGUE_API_KEY;

module.exports = axios;

const app = require('express')();

app.put('/:id', (req, res) => {
    const {password, username} = req.body;
    let resultString = "Succesfully changed: ";
    if (!password && !username) {
        return res.status(400);
    }
    if (password) {
        resultString += 'password '
        // change password in db.
    }
    if (username) {

        //chaneg username in db.
    }

})