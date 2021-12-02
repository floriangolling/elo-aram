function filterMatchesInfos(matches) {
    return matches.filter(match => match.info.gameMode === 'ARAM').map(m => {
        return {duration: m.gameDuration, participants: m.participants}
    });
}

module.exports = {
    filterMatchesInfos
}