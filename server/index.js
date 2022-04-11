const filters               = require('./src/controllers/elo-aram/filter-matches')
const leagueController      = require('./src/controllers/league-api')
const User                  = require('./src/database/models/user');
const DBinfos               = require('./src/database/index')
const { Match, UserMatch }  = require('./src/database/models');
const config                = require('./src/config/config');
const apiRouter             = require('./src/api');
const express               = require('express');
const app                   = express();
const {Worker}              = require('worker_threads');
const cors                  = require('cors');

app.use(cors());
app.use('/api', apiRouter);

DBinfos.init(DBinfos.sequelize)
.then(() => {
    app.listen(config.PORT, async () => {
        console.log(`Running on http://localhost:${config.PORT}`);
        serverUP = true;
        const worker = new Worker("./checkForUpdate.js");
        global.worker = worker;
    });
}).catch((err) => {
    console.log('\x1b[31m%s\x1b[0m', err);
});