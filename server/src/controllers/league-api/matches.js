const axios = require('../../axios/axios');
const config = require('../../config/config')

async function getMatchesIDsFromPPUID(ppuid, count) {
    const promise = await new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${ppuid}/ids?queue=450&start=0&count=${count}`)
            resolve(response.data)
        } catch (error) {
            reject (error)
        }
    })
    return (promise)
}

async function getMatchInfoFromID(matchID) {
    const promise = await new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchID}`)
            resolve(response.data)
        } catch (error) {
            reject (error)
        }
    })
    return (promise)
}

module.exports = {
    getMatchesIDsFromPPUID,
    getMatchInfoFromID
}
