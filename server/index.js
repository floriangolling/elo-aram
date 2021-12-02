const leagueController = require('./src/controllers/league-api')
const filters           = require('./src/controllers/elo-aram/filter-matches')

// Testing to retrieve matches infos.

async function findMatches() {
    const puuid = await leagueController.userController.getUserPUUIDByNameEUW('xxfrostbloodyxx')
    const matches = await leagueController.matchController.getMatchesIDsFromPPUID(puuid, 20);
    let matchesInfosArray = []
    for (const match of matches) {
        const m = await leagueController.matchController.getMatchInfoFromID(match);
        matchesInfosArray.push(m)
    }
    console.log(filters.filterMatchesInfos(matchesInfosArray))
}

findMatches()
