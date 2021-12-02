const axios     = require('axios');
const config    = require('../config/config');

axios.defaults.headers.common['X-Riot-Token'] = config.LEAGUE_API_KEY;

module.exports = axios;