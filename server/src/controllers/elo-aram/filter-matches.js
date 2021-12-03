function filterMatchesInfosARAM(matches) {
    return matches.filter(match => match.info.gameMode === 'ARAM').map(m => {
        return {duration: m.info.gameDuration, participants: m.info.participants, id: m.info.gameId}
    });
}

function filterMatchesInfos(matches) {
    return matches.map(m => {
        return {duration: m.info.gameDuration, participants: m.info.participants}
    });
}


module.exports = {
    filterMatchesInfos,
    filterMatchesInfosARAM
}