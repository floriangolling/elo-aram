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

async function getMatchesFilter(puuid) {
    return new Promise(async (resolve, reject) => {
        try {
            let array = [];
            const matches = await leagueController.matchController.getMatchesIDsFromPPUID(puuid, config.numberofGame);
            for (const match of matches) {
                let matchNameNoEUW = match.toString().substring(5);
                let Matche = await Match.findOne({where: {matchID: matchNameNoEUW}})
                if (Matche) {
                    console.log('skipping')
                    continue;
                }
                const m = await leagueController.matchController.getMatchInfoFromID(match);
                array.push(m);
            }
            const m = filters.filterMatchesInfosARAM(array);
            resolve(m);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('too many request')
                while(1);
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

        let numberFound = 0;
        let eloStacked = 0;

        for (const participants of match.participants) {
            const user = await User.findOne({where: {puuid: participants.puuid }});
            if (user.elo < 0)
                await user.update({elo: 0});
            if (user) {
                numberFound++;
                eloStacked += user.elo;
            }
        }
        eloStacked /= numberFound;
        for (participants of match.participants) {
            const user = await User.findOne({where: {puuid: participants.puuid}});
            if (!user)
                user = await User.create({puuid: participants.puuid, username: participants.summonerName, elo: eloStacked});
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
        obj.teamID2Elo /= 5;
        obj.teamID1Elo /= 5;
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
                const elo4 = getRatingDelta(gameObj.teamID2Elo, gameObj.teamID1Elo, 0);
                for (participants of match.participants) {
                    let user = await User.findOne({where: {puuid: participants.puuid}});
                    if (gameObj.winner == 1 && participants.teamId == gameObj.teamID1) {
                        await user.update({wins: user.wins + 1});
                        await user.update({elo: user.elo + elo1});
                    } else if (gameObj.winner == 0 && participants.teamId == gameObj.teamID1) {
                        await user.update({elo: user.elo + elo1 * -1});
                    } else if (gameObj.winner == 1 && participants.teamId == gameObj.teamID2) {
                        await user.update({elo: user.elo + elo4});
                    } else if (gameObj.winner == 0 && participants.teamId == gameObj.teamID2) {
                        await user.update({wins: user.wins + 1});
                        await user.update({elo: user.elo + (elo4 * -1)});
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
                let myMatch = {
                    participants: [],
                    id: match.id
                };
                for (const par of match.participants) {
                    myMatch.participants.push({
                        puuid: par.puuid,
                        summonerName: par.summonerName,
                        teamId: par.teamId,
                        win: par.win,
                        kills: par.kills,
                        deaths: par.deaths,
                        assists: par.assists,
                        championName: par.championName
                    })
                }
                await processNewMatch(myMatch);
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

module.exports = {
    refreshUser
}