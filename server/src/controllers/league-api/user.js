const config    = require('../../config/config')
const LolApi    = require('twisted').LolApi;
const api       = new LolApi(config.LEAGUE_API_KEY);

async function getUserPUUIDByNameEUW(username) {
    const promise = await new Promise(async (resolve, reject) => {
        try {
            const user = await api.Summoner.getByName(username, 'euw1');
            return resolve(user.response.puuid)
        } catch (error) {
            return reject (error)
        }
    })
    return (promise)
}

module.exports = {
    getUserPUUIDByNameEUW
}