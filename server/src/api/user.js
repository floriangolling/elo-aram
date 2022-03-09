const express = require('express')
const userRouter = express.Router();
const leagueController = require('../controllers/league-api')
const User = require('../database/models/user');
const UserMatch = require('../database/models/user_match');
const Match = require('../database/models/match');

async function findUserByPuuid(puuid) {
    const user = await User.findOne({where: {puuid}});
    return user.username;
}

function countOccurence(array) {
    return array.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});
}

function findAllAlliesOfMatch(playedMatch, puuid) {
    let result = [];
    let teamId = -1;
    for (const info of playedMatch) {
        if (info.puuid == puuid) {
            teamId = info.teamId;
            break;
        }
    }
    for (const info of playedMatch) {
        if (info.teamId == teamId && info.puuid != puuid) {
            result.push(info.puuid);
        }
    }
    return result;
}

userRouter.get('/:name', async(req, res) => {
    const {name} = req.params;
    try {
        let totalAllies = [];
        let totalKda = {
            kills: 0,
            deaths: 0,
            assists: 0,
        }
        let numberOfGames = 0;
        let numberOfWins = 0;
        let winrates = [];
        let championsWinrate = [];
        if (!name)
            return res.status(400).send({message: "not a valid name"})
        const puuid = await leagueController.matchController.getUserPUUIDByNameEUW(name)
        let user = await User.findOne({where: {puuid: puuid}});
        if (!user)
            user = await User.create({puuid: puuid, username: name})
        const matchesLink = await UserMatch.findAll({where: {UserId: user.id }});
        for (match of matchesLink) {
            const playedMatch = await Match.findOne({where: {id: match.MatchId}})
            const playedWith = findAllAlliesOfMatch(playedMatch.matchInfos, puuid);
            for (const el of playedWith)
                totalAllies.push(el);
            let playerData = null;
            for (const info of playedMatch.matchInfos) {
                if (info.puuid == user.puuid) {
                    playerData = info;
                    break;
                }
            }
            if (playerData) {
                if (playerData.win) {
                    numberOfWins++
                    numberOfGames++;
                    winrates.push(Math.trunc((numberOfWins / numberOfGames) * 100));
                } else {
                    numberOfGames++;
                    winrates.push(Math.trunc((numberOfWins / numberOfGames) * 100));
                }
                totalKda.kills += playerData.kills;
                totalKda.deaths += playerData.deaths;
                totalKda.assists += playerData.assists;
                if (!championsWinrate.find(elem => elem.championName == playerData.championName)) {
                    if (playerData.win) {
                        championsWinrate.push({championName: playerData.championName, games: 1, win: 1, kills: playerData.kills, deaths: playerData.deaths, assists: playerData.assists})
                    }
                    else {
                        championsWinrate.push({championName: playerData.championName, games: 1, win: 0, kills: playerData.kills, deaths: playerData.deaths, assists: playerData.assists})
                    }
                } else {
                    for (const wr of championsWinrate) {
                        if (wr.championName == playerData.championName) {
                            if (playerData.win) {
                                wr.win += 1
                            }
                            wr.games += 1;
                            wr.assists += playerData.assists;
                            wr.kills += playerData.kills;
                            wr.deaths += playerData.deaths;
                        }
                    }
                }
            }
        }
        for (const wr of championsWinrate) {
            wr.winrate = (wr.win / wr.games) * 100
            wr.deaths /= wr.games;
            wr.kills /= wr.games;
            wr.assists /= wr.games;
        }
        totalKda.kills /= user.games;
        totalKda.assists /= user.games;
        totalKda.deaths /= user.games;
        let occurences = countOccurence(totalAllies)
        let key = Object.keys(occurences).reduce(function(a, b){ return occurences[a] > occurences[b] ? a : b });
        let favoritePersonName = await findUserByPuuid(key);
        let mostPlayedWith = {
            username: favoritePersonName,
            played: occurences[key],
        }
        const maxPlayedChamp = championsWinrate.reduce(function(prev, current) {
            return (prev.games > current.games) ? prev : current
        })
        return res.status(200).send({winrate: user.winrate, username: user.username, elo: user.elo, games: user.games, wins: user.wins, totalKda ,championsWinrate, winrates, mostPlayedWith, maxPlayedChamp});
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = userRouter;