const Match = require('./src/database/models/match')

async function refactorMatch() {
    try {
        for (let i = 0; i <= 494366; i++) {
            const match = await Match.findOne({where: {id: i}});
            if (!match)
                continue;
                let RefactoredMatch = [];
                const matchInfos = match.matchInfos;
                for (const par of matchInfos) {
                    RefactoredMatch.push({
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
            await match.update({matchInfos: RefactoredMatch})
            console.log(i);
        }
        console.log('finished')
    } catch (error) {
        console.log(error)
    }
}