const leagueController = require('./src/controllers/league-api')
const filters           = require('./src/controllers/elo-aram/filter-matches')
const DBinfos           = require('./src/database/index')
const express           = require('express');
const app               = express();
const User              = require('./src/database/models/user');
const { Match, UserMatch } = require('./src/database/models');

function getRatingDelta(myRating, opponentRating, myGameResult) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
      return null;
    }
    
    var myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.round(32 * (myGameResult - myChanceToWin));
  }

  function getNewRating(myRating, opponentRating, myGameResult) {
    return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
  }

async function findMatches(name) {
    let newMatch = false
    const promise = await new Promise(async (resolve, reject) => {
        let matchesInfosArray = []
        try {
        const puuid = await leagueController.userController.getUserPUUIDByNameEUW(name)
        const matches = await leagueController.matchController.getMatchesIDsFromPPUID(puuid, 10);
        for (const match of matches) {
            const m = await leagueController.matchController.getMatchInfoFromID(match);
            matchesInfosArray.push(m)
        }
        } catch (error ){
            reject(error)
        }
        const m = filters.filterMatchesInfosARAM(matchesInfosArray)
        for (ma of m) {
            for (participants of ma.participants) {
                try {
                    let user = await User.findOne({where: {puuid: participants.puuid}});
                    if (!user) {
                        user = await User.create({puuid: participants.puuid, username: participants.summonerName})
                    }
                    let match = await Match.findOne({where: {matchID: ma.id.toString()}})
                    if (!match) {
                        newMatch = true
                        match = await Match.create({matchID: ma.id.toString(), matchInfos: ma.participants})
                    }
                    let link = await UserMatch.findOne({where: {MatchId: match.id, UserId: user.id}})
                    if (!link)
                        link = await UserMatch.create({MatchId: match.id, UserId: user.id})
                } catch (error) {
                    console.log(error)
                }
            }

            // find team ID and who won
            let winner = -1;
            let teamID1 = -1;
            let teamID2 = -1;
            let teamID2Elo = 0;
            let teamID1Elo = 0;
            if (newMatch) {
                for (participants of ma.participants) {
                    const user = await User.findOne({where: {puuid: participants.puuid}});
                    if (teamID1 === -1) {
                        teamID1 = participants.teamId;
                        teamID1Elo += user.elo;
                    }
                    if (participants.teamId !== teamID1) {
                        teamID2Elo += user.elo;
                        teamID2 = participants.teamId
                    }
                    if (participants.teamId == teamID1 && participants.win === true) {
                        winner = 1;
                    }
                    if (participants.teamId == teamID2 && participants.win === true) {
                        winner = 0;
                    }
                }
                const elo1 = getRatingDelta(teamID1Elo, teamID2Elo, 1);
                for (participants of ma.participants) {
                    let user = await User.findOne({where: {puuid: participants.puuid}});
                    if (winner == 1 && participants.teamId == teamID1) {
                        user.set({elo: user.elo + elo1})
                    } else if (winner == 0 && participants.teamId == teamID1) {
                        user.set({elo: user.elo - elo1})
                    } else if (winner == 1 && participants.teamId == teamID2) {
                        user.set({elo: user.elo - elo1})
                    } else if (winner == 0 && participants.teamId == teamID2) {
                        user.set({elo: user.elo + elo1})
                    }
                    await user.save()
                }
            }
        }
        resolve()
    })
    return promise
}

DBinfos.init(DBinfos.sequelize)
.then(() => {
    app.listen(8080, () => {
        console.log('running on http://localhost:8080');
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

async function checkForUpdate() {
    const promise = await new Promise(async(resolve, reject) => {
        try {
            const users = await User.findAll();
            for (const user of users) {
                await new Promise(async(resolve, reject) => {
                    try {
                        await findMatches(user.username)
                        await sleep(60000)
                        resolve()
                    } catch (error) {
                        reject(error)
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
        resolve()
    })
    checkForUpdate()
}

checkForUpdate()