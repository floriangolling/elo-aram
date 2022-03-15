const axios = require('../../axios/axios');
const config = require('../../config/config')
const LolApi    = require('twisted').LolApi;
const api       = new LolApi(config.LEAGUE_API_KEY);

let numberOfRequests = 0;

let startClockValue = new Date().getTime();

function startClock() {
    if (numberOfRequests === 1) {
        startClockValue = new Date().getTime();
    }
}

function checkTime() {
    if (numberOfRequests >= 99) {
        let endTwo = new Date().getTime();
        console.log('in clock')
        while (endTwo - startClockValue < 120500) {
            endTwo = new Date().getTime();
        }
        console.log('out clock')
    }
}

function setNumberOfRequest(headers) {
    numberOfRequests = parseInt(headers['x-app-rate-limit-count'].split(',')[1].split(':')[0]);
    console.log(numberOfRequests);
}

async function getUserPUUIDByNameEUW(username) {
    const promise = await new Promise(async (resolve, reject) => {
        try {
            checkTime();
            const user = await api.Summoner.getByName(username, 'euw1');
            numberOfRequests++;
            startClock();
            return resolve(user.response.puuid)
        } catch (error) {
            return reject (error)
        }
    })
    return (promise)
}

async function getMatchesIDsFromPPUID(ppuid, count) {
    const promise = await new Promise(async (resolve, reject) => {
        try {
            checkTime();
            const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${ppuid}/ids?queue=450&start=0&count=${count}`)
            setNumberOfRequest(response.headers);
            startClock();
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
            checkTime();
            const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchID}`)
            setNumberOfRequest(response.headers);
            startClock();
            resolve(response.data)
        } catch (error) {
            reject (error)
        }
    })
    return (promise)
}

module.exports = {
    getMatchesIDsFromPPUID,
    getMatchInfoFromID,
    getUserPUUIDByNameEUW
}
