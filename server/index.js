const filters               = require('./src/controllers/elo-aram/filter-matches')
const leagueController      = require('./src/controllers/league-api')
const User                  = require('./src/database/models/user');
const DBinfos               = require('./src/database/index')
const { Match, UserMatch }  = require('./src/database/models');
const config                = require('./src/config/config');
const apiRouter             = require('./src/api');
const express               = require('express');
const app                   = express();
let numberOfRequests        = 0;

app.use('/api', apiRouter);

async function getMatchesFilter(puuid) {
    return new Promise(async (resolve, reject) => {
        try {
            let array = [];
            const matches = await leagueController.matchController.getMatchesIDsFromPPUID(puuid, config.numberofGame);
            numberOfRequests++;
            for (const match of matches) {
                const m = await leagueController.matchController.getMatchInfoFromID(match);
                numberOfRequests++;
                array.push(m);
            }
            const m = filters.filterMatchesInfosARAM(array);
            resolve(m);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                numberOfRequests = 100;
            }
            console.log(error);
            resolve([]);
        }
    })
}

async function checkUserAndRefreshUsername(participants) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({where: {puuid: participants.puuid}});
            if (user && participants.summonerName != user.username) {
                await user.set({username: participants.summonerName})
                await user.save();
            }
            if (!user) {
                user = await User.create({puuid: participants.puuid, username: participants.summonerName})
            }
            resolve(user);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

async function checkWinner(match) {
    return new Promise(async (resolve, reject) => {
        let obj = {
            winner : -1,
            teamID1 : -1,
            teamID2 : -1,
            teamID2Elo : 0,
            teamID1Elo : 0
        }

        for (participants of match.participants) {
            const user = await User.findOne({where: {puuid: participants.puuid}});
            if (!user)
                user = await User.create({puuid: participants.puuid, username: participants.summonerName})
            if (obj.teamID1 === -1) {
                obj.teamID1 = participants.teamId;
                obj.teamID1Elo += user.elo;
            }
            if (participants.teamId !== obj.teamID1) {
                obj.teamID2Elo += user.elo;
                obj.teamID2 = participants.teamId
            }
            if (participants.teamId == obj.teamID1 && participants.win === true) {
                obj.winner = 1;
            }
            if (participants.teamId == obj.teamID2 && participants.win === true) {
                obj.winner = 0;
            }
        }
        resolve(obj);
    })
}

async function processNewMatch(match) {
    return new Promise(async (resolve, reject) => {
        try {
            let newMatch = false;
            for (participants of match.participants) {
                const user = await checkUserAndRefreshUsername(participants);
                if (user) {
                    let Matche = await Match.findOne({where: {matchID: match.id.toString()}})
                    if (!Matche) {
                        newMatch = true;
                        Matche = await Match.create({matchID: match.id.toString(), matchInfos: match.participants})
                    }
                    let link = await UserMatch.findOne({where: {MatchId: Matche.id, UserId: user.id}})
                    if (!link) {
                        link = await UserMatch.create({MatchId: Matche.id, UserId: user.id})
                        await user.update({games: user.games + 1});
                    }
                }
            }
            if (newMatch === true) {
                const gameObj = await checkWinner(match);
                const elo1 = getRatingDelta(gameObj.teamID1Elo, gameObj.teamID2Elo, 1);
                const elo2 = getRatingDelta(gameObj.teamID1Elo, gameObj.teamID2Elo, 0);
                const elo3 = getRatingDelta(gameObj.teamID2Elo, gameObj.teamID1Elo, 1);
                const elo4 = getRatingDelta(gameObj.teamID2Elo, gameObj.teamID1Elo, 0);
                for (participants of match.participants) {
                    let user = await User.findOne({where: {puuid: participants.puuid}});
                    if (gameObj.winner == 1 && participants.teamId == gameObj.teamID1) {
                        await user.update({wins: user.wins + 1});
                        await user.update({elo: user.elo + elo1});
                    } else if (gameObj.winner == 0 && participants.teamId == gameObj.teamID1) {
                        await user.update({elo: user.elo + elo2});
                    } else if (gameObj.winner == 1 && participants.teamId == gameObj.teamID2) {
                        await user.update({elo: user.elo + elo4});
                    } else if (gameObj.winner == 0 && participants.teamId == gameObj.teamID2) {
                        await user.update({wins: user.wins + 1});
                        await user.update({elo: user.elo + elo3});
                    }
                    user = await User.findOne({where: {puuid: participants.puuid}});
                    await user.update({winrate: (user.wins / user.games) * 100 });
                }
            }
            resolve();
        } catch (error) {
            console.log(error);
            resolve();
        }
    })
}


async function refreshUser(puuid) {
    return new Promise( async (resolve, reject) => {
        try {
            let matches = await getMatchesFilter(puuid)
            for (const match of matches) {
                await processNewMatch(match);
            }
            resolve();
        } catch (error) {
            console.log(error);
            resolve();
        }
    })
}


function getRatingDelta(myRating, opponentRating, myGameResult) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
      return null;
    }
    let myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));
    return Math.round(32 * (myGameResult - myChanceToWin));
}

DBinfos.init(DBinfos.sequelize)
.then(() => {
    app.listen(8081, async () => {
        console.log('running on http://localhost:8081');
        checkForUpdate()
    });
}).catch((err) => {
    console.log('\x1b[31m%s\x1b[0m', err);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function resetElo() {
    try {
        const users = await User.findAll();
        for (const user of users) {
            await user.set({elo: 1200})
            await user.save()
        }
    } catch (error) {
        console.log(error)
    }
}

function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
  

async function checkForUpdate() {
    const id = parseInt(require('fs').readFileSync('last.txt', 'utf-8'))
    const promise = await new Promise(async (resolve, reject) => {
        try {
            const users = await User.findAll({order: [['id', 'ASC']]});
            let start = new Date().getTime();
            for (const user of users) {
                if (user.id <= id)
                    continue;
                console.log(user.username)
                let end = new Date().getTime();
                let time = end - start;
                if (time >= 130000) {
                    console.log('refreshed Timed');
                    start = new Date().getTime();
                    numberOfRequests = 0;
                }
                if (numberOfRequests >= 100 - (config.numberofGame + 2)) {
                    console.log('too many request, waiting for reset...')
                    let endTwo = new Date().getTime();
                    while (endTwo - start < 130000) {
                        endTwo = new Date().getTime();
                        //console.log(millisToMinutesAndSeconds(endTwo - start))
                    }
                    numberOfRequests = 0;
                    start = new Date().getTime();
                    console.log('reset')
                }
                await refreshUser(user.puuid)
                require('fs').writeFileSync('last.txt', user.id.toString() ,{
                    encoding: 'utf-8'
                })
            }
        } catch (error) {
            console.log(error);
        }
        resolve()
    })
    require('fs').writeFileSync('last.txt', "0" ,{
        encoding: 'utf-8'
    })
    checkForUpdate()
}